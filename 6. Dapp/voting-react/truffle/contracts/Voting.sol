// SPDX-License-Identifier: MIT

pragma solidity 0.8.14;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Decentralized Voting
/// @author Quentin de Chateaubriant
/// @notice You can use this contract to vote on proposals
/// @dev Contract has been audited for security and gas optimization
contract Voting is Ownable {

    uint128 winningProposalID;
    uint128 maxVotes;

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint128 votedProposalId;
    }

    struct Proposal {
        string description;
        uint128 voteCount;
    }

    enum  WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    WorkflowStatus public workflowStatus;
    Proposal[] proposalsArray;
    mapping (address => Voter) voters;


    event VoterRegistered(address _voterAddress);
    event WorkflowStatusChange(WorkflowStatus _previousStatus, WorkflowStatus _newStatus);
    event ProposalRegistered(uint _proposalId);
    event Voted (address _voter, uint _proposalId);

    /// @dev Modifier allowing only users registered in "voters" mapping to vote
    modifier onlyVoters() {
        require(voters[msg.sender].isRegistered, "You're not a voter");
        _;
    }

    // ::::::::::::: GETTERS ::::::::::::: //

    /// @notice Returns information about the voter whose address is given as a param
    /// @param _addr the address of the voter
    function getVoter(address _addr) external onlyVoters view returns (Voter memory) {
        return voters[_addr];
    }

    /// @notice Returns information about the proposal which id is given as a param
    /// @param _id the id of the proposal
    function getOneProposal(uint _id) external onlyVoters view returns (Proposal memory) {
        return proposalsArray[_id];
    }

    /// @notice Returns the winning proposal
    /// @return A Proposal struct
    /// @dev The workflowStatus needs to be set to "VotesTallied" for the function to execute
    function getWinningProposal() external view returns (Proposal memory) {
        require(workflowStatus == WorkflowStatus.VotesTallied, "The vote is not over yet");
        return proposalsArray[winningProposalID];
    }


    // ::::::::::::: REGISTRATION ::::::::::::: //

    /// @notice Function called by the contract owner to register voters
    /// @param _addr The address of the voter to be registered
    /// @dev Only the owner can execute this function, which raises a "VoterRegistered" event
    function addVoter(address _addr) external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, 'Voters registration is not open yet');
        require(voters[_addr].isRegistered != true, 'Already registered');

        voters[_addr].isRegistered = true;
        emit VoterRegistered(_addr);
    }


    // ::::::::::::: PROPOSAL ::::::::::::: //

    /// @notice Function called to add a proposal
    /// @param _desc Represents the description of the proposal as a String
    /// @dev Only voters can execute this function, not the owner. It raises a "ProposalRegistered" event.
    function addProposal(string calldata _desc) external onlyVoters {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, 'Proposals are not allowed yet');
        require(keccak256(abi.encode(_desc)) != keccak256(abi.encode("")), 'Vous ne pouvez pas ne rien proposer');
        // voir que desc est different des autres

        proposalsArray.push(Proposal(_desc, 0));
        emit ProposalRegistered(proposalsArray.length-1);
    }

    // ::::::::::::: VOTE ::::::::::::: //

    /**
    @notice Function used to allow voters to vote for a proposal
    @param _id The id of the psoposal for which the voter decides to vote
    @dev Only voters can execute this function. Voterc can only vote once. The function also calculates after each votes which proposal
    is winning.
    */
    function setVote( uint128 _id) external onlyVoters {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, 'Voting session havent started yet');
        require(voters[msg.sender].hasVoted != true, 'You have already voted');
        require(_id < proposalsArray.length, 'Proposal not found'); // pas obligé, et pas besoin du >0 car uint

        voters[msg.sender].votedProposalId = _id;
        voters[msg.sender].hasVoted = true;
        proposalsArray[_id].voteCount++;
        if(proposalsArray[_id].voteCount > maxVotes) {
            winningProposalID = _id;
            maxVotes = proposalsArray[_id].voteCount;
        }

        emit Voted(msg.sender, _id);
    }

    // ::::::::::::: STATE ::::::::::::: //

    /// @notice Series of state management functions used by the contract owner to set the workflow status
    /// @dev Only the owner can execute these. They are used to organize the vote by restricting some functions use ans allowing others
    function startProposalsRegistering() external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, 'Registering proposals cant be started now');
        workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);
    }

    function endProposalsRegistering() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, 'Registering proposals havent started yet');
        workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);
    }

    function startVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationEnded, 'Registering proposals phase is not finished');
        workflowStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);
    }

    function endVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, 'Voting session havent started yet');
        workflowStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded);
    }

    function tallyVotes() external onlyOwner {
        require(workflowStatus == WorkflowStatus.VotingSessionEnded, 'Voting session havent ended yet');
        workflowStatus = WorkflowStatus.VotesTallied;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied);
    }
}