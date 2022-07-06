    const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
    const { expect } = require('chai');
    const constants = require('@openzeppelin/test-helpers/src/constants');
    const Voting = artifacts.require('Voting.sol');

    contract("Voting", function(accounts) {
        const owner = accounts[0];
        const voterAddress = accounts[1];
        const secondVoterAddress = accounts[2];
        const thirdVoterAddress = accounts[3];
        const proposalDescription = "La Proposal";
        const secondProposalDescription = "La Proposal#2";

        beforeEach(async function () {
            this.VotingInstance = await Voting.new({from: owner});
        });

        describe("getVoter function", function() {
            beforeEach(async function() {
                await this.VotingInstance.addVoter(voterAddress, {from: owner});
                await this.VotingInstance.addVoter(secondVoterAddress, {from: owner});
                await this.VotingInstance.addVoter(thirdVoterAddress, {from: owner});
            });

            it("Should return the right voter if given an index", async function() {
                const result = await this.VotingInstance.getVoter(secondVoterAddress, {from: voterAddress});
                expect(result.isRegistered).to.equal(true);
                expect(result.hasVoted).to.equal(false);
                expect(result.votedProposalId).to.be.bignumber.equal(new BN(0));
            });

            it("Should not be executable by non-voters", async function() {
                await expectRevert(this.VotingInstance.getVoter(thirdVoterAddress, {from: accounts[4]}),"You're not a voter");
            });
        });

        describe("getOneProposal function", function() {
            beforeEach(async function() {
                await this.VotingInstance.addVoter(voterAddress, {from: owner});
                await this.VotingInstance.startProposalsRegistering({from: owner});
                await this.VotingInstance.addProposal(proposalDescription, {from: voterAddress});
                await this.VotingInstance.addProposal(secondProposalDescription, {from: voterAddress});
            });

            it("Should return the right proposal if given an index", async function() {
                const result = await this.VotingInstance.getOneProposal(1, {from: voterAddress});
                expect(result.description).to.equal(secondProposalDescription);
                expect(result.voteCount).to.be.bignumber.equal(new BN(0));
            });

            it("Should not be executable by non-voters", async function() {
                await expectRevert(this.VotingInstance.getOneProposal(0, {from: accounts[2]}),"You're not a voter");
            });
        });

        describe("addVoter function", function() {
            it("Should correctly register a voter", async function() {
                const addingVoter = await this.VotingInstance.addVoter(voterAddress, {from: owner});
                const result = await this.VotingInstance.getVoter(voterAddress, {from:voterAddress});

                /* Assertions */
                expect(result.isRegistered).to.equal(true);
                expect(result.hasVoted).to.equal(false);

                /* Events */
                expectEvent(addingVoter, 'VoterRegistered',
                    {voterAddress: voterAddress}
                );
            });

            it("Should not allow voter registration during wrong WorkFlowStatus", async function() {
                await this.VotingInstance.startProposalsRegistering({from: owner});
                let addVoterFunction = this.VotingInstance.addVoter(voterAddress, {from: owner});

                await expectRevert(addVoterFunction,'Voters registration is not open yet');
            });

            it("Should not allow to add the same voter several times", async function() {
                await this.VotingInstance.addVoter(voterAddress, {from: owner});
                let addVoterFunction = this.VotingInstance.addVoter(voterAddress, {from: owner});

                await expectRevert(addVoterFunction,'Already registered');
            });

            it("Should only be executable by contract Owner", async function() {
                const addingVoter = await this.VotingInstance.addVoter(voterAddress, {from: owner});

                await expectRevert(this.VotingInstance.addVoter(voterAddress, {from: accounts[2]}),"Ownable: caller is not the owner");
            });

        });

        describe("addProposal function", function() {
            it("Should add a proposal in the proposalsArray if done by a voter", async function() {
                await this.VotingInstance.addVoter(voterAddress, {from: owner});
                await this.VotingInstance.startProposalsRegistering({from: owner});

                const result = await this.VotingInstance.addProposal(proposalDescription, {from: voterAddress});

                /*On store une proposal, qui sera a l'index '0'*/
                const proposalFromArray = await this.VotingInstance.getOneProposal(0, {from: voterAddress});
                expect(proposalFromArray.description).to.equal(proposalDescription);

                expectEvent(result, 'ProposalRegistered', this.VotingInstance.proposalsArray -1);
            });

            it("Should not allow proposal registration during the wrong workflow status", async function() {
                await this.VotingInstance.addVoter(voterAddress, {from: owner});
                const registerProposal = this.VotingInstance.addProposal(proposalDescription, {from: voterAddress});

                await expectRevert(registerProposal, 'Proposals are not allowed yet');
            });

            it("Should not allow proposal registration from non-voters", async function() {
                await this.VotingInstance.startProposalsRegistering({from: owner});
                const registerProposal = this.VotingInstance.addProposal(proposalDescription, {from: voterAddress});

                await expectRevert(registerProposal, "You're not a voter");
            });

            it("Should not allow the registration of an empty description", async function() {
                await this.VotingInstance.addVoter(voterAddress, {from: owner});
                await this.VotingInstance.startProposalsRegistering({from: owner});
                const registerProposal = this.VotingInstance.addProposal("", {from: voterAddress});

                await expectRevert(registerProposal, 'Vous ne pouvez pas ne rien proposer');
            });
        });

        describe("setVote function", function() {
            beforeEach(async function() {
                await this.VotingInstance.addVoter(voterAddress, {from: owner});
                await this.VotingInstance.startProposalsRegistering({from: owner});
                await this.VotingInstance.addProposal(proposalDescription, {from: voterAddress});
            });

            const voteId = new BN(1);
            it("Should register voter's vote & status", async function(){
                let voter = await this.VotingInstance.getVoter(voterAddress, {from: voterAddress});
                await this.VotingInstance.addProposal(secondProposalDescription, {from: voterAddress});
                await this.VotingInstance.endProposalsRegistering({from: owner});
                await this.VotingInstance.startVotingSession({from: owner});
                let proposalFromArray = await this.VotingInstance.getOneProposal(1, {from: voterAddress});

                expect(voter.hasVoted).to.equal(false);
                expect(voter.votedProposalId).to.be.bignumber.equal(new BN(0));
                expect(proposalFromArray.voteCount).to.be.bignumber.equal(new BN(0));

                const result = await this.VotingInstance.setVote(1, {from: voterAddress});

                voter = await this.VotingInstance.getVoter(voterAddress, {from: voterAddress});
                proposalFromArray = await this.VotingInstance.getOneProposal(1, {from: voterAddress});

                expect(voter.hasVoted).to.equal(true);
                expect(voter.votedProposalId).to.be.bignumber.equal(voteId);
                expect(proposalFromArray.voteCount).to.be.bignumber.equal(voteId);

                expectEvent(result, 'Voted', {voter: voterAddress, proposalId: voteId});
            });

            it("Should not allow non-voters to vote", async function(){
                await this.VotingInstance.endProposalsRegistering({from: owner});
                await this.VotingInstance.startVotingSession({from: owner});

                await expectRevert(this.VotingInstance.setVote(0, {from: owner}), "You're not a voter");
            });

            it("Should not allow voters to vote twice", async function(){
                await this.VotingInstance.endProposalsRegistering({from: owner});
                await this.VotingInstance.startVotingSession({from: owner});

                await this.VotingInstance.setVote(0, {from: voterAddress});
                await expectRevert(this.VotingInstance.setVote(0, {from: voterAddress}), 'You have already voted');
            });

            it("Should not allow voters to vote for non existing proposals", async function(){
                await this.VotingInstance.endProposalsRegistering({from: owner});
                await this.VotingInstance.startVotingSession({from: owner});

                await expectRevert(this.VotingInstance.setVote(10, {from: voterAddress}), 'Proposal not found');
            });

            it("Should not allow proposal registration during the wrong workflow status", async function() {
                await this.VotingInstance.addProposal(secondProposalDescription, {from: voterAddress});
                await this.VotingInstance.endProposalsRegistering({from: owner});

                const result = this.VotingInstance.setVote(0, {from: voterAddress});

                await expectRevert(result, 'Voting session havent started yet');
            });
        });

        describe("Manual State Change Functions", function() {
            const startProposalRegisteringStatus = new BN(1);
            const endProposalRegisteringStatus = new BN(2);
            const startVotingStatus = new BN(3);
            const endVotingStatus = new BN(4);

            it("Should properly change the workflow state", async function() {
                let result = await this.VotingInstance.startProposalsRegistering({from: owner});
                expect(await this.VotingInstance.workflowStatus.call()).to.be.bignumber.equal(startProposalRegisteringStatus);
                expectEvent(result, 'WorkflowStatusChange', {
                    previousStatus: new BN(Voting.WorkflowStatus.RegisteringVoters),
                    newStatus: new BN(Voting.WorkflowStatus.ProposalsRegistrationStarted)});

                result = await this.VotingInstance.endProposalsRegistering({from: owner});
                expect(await this.VotingInstance.workflowStatus.call()).to.be.bignumber.equal(endProposalRegisteringStatus);
                expectEvent(result, 'WorkflowStatusChange', {
                    previousStatus: new BN(Voting.WorkflowStatus.ProposalsRegistrationStarted),
                    newStatus: new BN(Voting.WorkflowStatus.ProposalsRegistrationEnded)});

                result = await this.VotingInstance.startVotingSession({from: owner});
                expect(await this.VotingInstance.workflowStatus.call()).to.be.bignumber.equal(startVotingStatus);
                expectEvent(result, 'WorkflowStatusChange', {
                    previousStatus: new BN(Voting.WorkflowStatus.ProposalsRegistrationEnded),
                    newStatus: new BN(Voting.WorkflowStatus.VotingSessionStarted)});

                result = await this.VotingInstance.endVotingSession({from: owner});
                expect(await this.VotingInstance.workflowStatus.call()).to.be.bignumber.equal(endVotingStatus);
                expectEvent(result, 'WorkflowStatusChange', {
                    previousStatus: new BN(Voting.WorkflowStatus.VotingSessionStarted),
                    newStatus: new BN(Voting.WorkflowStatus.VotingSessionEnded)});
            });

            it("Should Only be used by contract owner", async function() {
                await expectRevert(this.VotingInstance.startProposalsRegistering({from: voterAddress}), "Ownable: caller is not the owner");
            });

            it("Should Only be possible to change the workflow status in the right order", async function() {
                await this.VotingInstance.startProposalsRegistering({from: owner});
                await expectRevert(this.VotingInstance.startProposalsRegistering({from: owner}), 'Registering proposals cant be started now');
                await expectRevert(this.VotingInstance.startVotingSession({from: owner}), 'Registering proposals phase is not finished');
                await expectRevert(this.VotingInstance.endVotingSession({from: owner}), 'Voting session havent started yet');

                await this.VotingInstance.endProposalsRegistering({from: owner});
                await this.VotingInstance.startVotingSession({from: owner});
                await expectRevert(this.VotingInstance.endProposalsRegistering({from: owner}), 'Registering proposals havent started yet');
            });
        });

        describe("TallyVotes function", function() {
            const winningProposalId = new BN(1);
            const tallyVotesStatus = new BN(5);

            beforeEach(async function() {
                await this.VotingInstance.addVoter(voterAddress, {from: owner});
                await this.VotingInstance.addVoter(secondVoterAddress, {from: owner});
                await this.VotingInstance.addVoter(thirdVoterAddress, {from: owner});
                await this.VotingInstance.startProposalsRegistering({from: owner});
                await this.VotingInstance.addProposal(proposalDescription, {from: voterAddress});
                await this.VotingInstance.addProposal(secondProposalDescription, {from: voterAddress});
                await this.VotingInstance.endProposalsRegistering({from: owner});
                await this.VotingInstance.startVotingSession({from: owner});
                await this.VotingInstance.setVote(winningProposalId, {from: voterAddress});
                await this.VotingInstance.setVote(winningProposalId, {from: secondVoterAddress});
                await this.VotingInstance.setVote(new BN(0), {from: thirdVoterAddress});
            });

            it("Should correctly select a winning proposal", async function() {
                await this.VotingInstance.endVotingSession({from: owner});
                await this.VotingInstance.tallyVotes({from: owner});

                expect(await this.VotingInstance.winningProposalID.call()).to.be.bignumber.equal(winningProposalId);
            });

            it("Should correctly update workflow", async function() {
                await this.VotingInstance.endVotingSession({from: owner});
                const result = await this.VotingInstance.tallyVotes({from: owner});

                expect(await this.VotingInstance.workflowStatus.call()).to.be.bignumber.equal(tallyVotesStatus);
                expectEvent(result, 'WorkflowStatusChange', {
                    previousStatus: new BN(Voting.WorkflowStatus.VotingSessionEnded),
                    newStatus: new BN (Voting.WorkflowStatus.VotesTallied)});
            });

            it("Should only be executable by the contract owner", async function() {
                await this.VotingInstance.endVotingSession({from: owner});
                await expectRevert(this.VotingInstance.tallyVotes({from: voterAddress}), "Ownable: caller is not the owner");
            });

            it("Should only be executable during the right workflow status", async function() {
                await expectRevert(this.VotingInstance.tallyVotes({from: owner}), "Current status is not voting session ended");
            });
        });
    });
