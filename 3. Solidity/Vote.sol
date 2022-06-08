// SPDX-License-Identifier: MIT
pragma solidity 0.8.*;

import"https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
 
contract Voting is Ownable {
    uint winningProposalId;
    mapping(address => Voter) _voters;
    Proposal[] public _proposals;
    WorkflowStatus _voteState;

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    constructor() {
        _voteState = WorkflowStatus.RegisteringVoters;
    }

    struct Proposal {
        string description;
        uint voteCount;
    }

    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    event VoterRegistered(address voterAddress); 
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered(uint proposalId);
    event Voted (address voter, uint proposalId);


    modifier onlyRegisteredVoters() {
        require(_voters[msg.sender].isRegistered, "only registered users are allowed to perform this action.");
        _;
    }
    
    function getWinner() public view returns(uint) {
        require(_voteState == WorkflowStatus.VotesTallied, "Voting session still ongoing.");
        return winningProposalId;
    }

    function getWinningProposal() public view returns(string memory) {
        require(_voteState == WorkflowStatus.VotesTallied, "Voting session still ongoing.");
        return _proposals[winningProposalId].description;
    }

    function getVote(address _address) public  view returns(uint) {
        require(_voters[msg.sender].isRegistered || isOwner(), "only registered users or contract owner are allowed to perform this action.");
        require(_voters[_address].hasVoted, "Voter has not voted yet");
        return _voters[_address].votedProposalId;
    }

    function registerVoter(address _address) onlyOwner public {
        require(_voteState == WorkflowStatus.RegisteringVoters, "Registration period ended.");
        require(!_voters[_address].isRegistered, "Voter already registered.");
        _voters[_address].isRegistered = true;
        _voters[_address].hasVoted = false;
        emit VoterRegistered(_address);
    }

    function registerProposal(string memory _description) public onlyRegisteredVoters {
        require(_voteState == WorkflowStatus.ProposalsRegistrationStarted, "Proposals registration is not possible at this stage.");
        _proposals.push(Proposal(_description, 0));
        // Cost in gas d'incrémenter un proposal ID en variable d'état vs faire un _proposal.length à chaque event ?
        emit ProposalRegistered(_proposals.length);
    }

    function voteForProposal(uint _proposalIndex) public onlyRegisteredVoters {
        require(_voteState == WorkflowStatus.VotingSessionStarted, "Voting is not possible at this stage.");
        require(!_voters[msg.sender].hasVoted, "Voter has already voted");
        _voters[msg.sender].hasVoted = true;
        _voters[msg.sender].votedProposalId = _proposalIndex;
        _proposals[_proposalIndex].voteCount += 1;
        emit Voted(msg.sender, _proposalIndex);
    }

    function tallyVotes() public onlyOwner {
        require(_voteState == WorkflowStatus.VotingSessionEnded, "Voting is not possible at this stage.");
        uint maxVotes;

        for(uint i = 0; i < _proposals.length; i++) {
            if(_proposals[i].voteCount > maxVotes) {
                maxVotes = _proposals[i].voteCount;
                winningProposalId = i;
            }
        }
        markVotesAsTallied();
    }

    /*Workflow state management*/
    
    function initiatePropsalsRegistration() onlyOwner public {
        require(_voteState == WorkflowStatus.RegisteringVoters, "Wrong workflow execution order.");
        _voteState = WorkflowStatus.ProposalsRegistrationStarted;
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);
    }

    function closePrpopsalsRegistration() onlyOwner public {
        require(_voteState == WorkflowStatus.ProposalsRegistrationStarted, "Wrong workflow execution order.");
        _voteState = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);
    }

    function initiateVotingSession() onlyOwner public {
        require(_voteState == WorkflowStatus.ProposalsRegistrationEnded, "Wrong workflow execution order.");
        _voteState = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);
    }
    
    function closeVotingSession() onlyOwner public {
        require(_voteState == WorkflowStatus.VotingSessionStarted, "Wrong workflow execution order.");
        _voteState = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded);
    }
    
    function markVotesAsTallied() onlyOwner private {
        require(_voteState == WorkflowStatus.VotingSessionEnded, "Wrong workflow execution order.");
        _voteState = WorkflowStatus.VotesTallied;
        emit WorkflowStatusChange( WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied);
    }

    /*Functions for test purposes - To be Deleted in Prod*/
    function TESTregisterVoters() onlyOwner public {
        registerVoter(0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2);
        registerVoter(0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db);
        registerVoter(0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB);
        registerVoter(0x617F2E2fD72FD9D5503197092aC168c91465E7f2);
        registerVoter(0x17F6AD8Ef982297579C203069C1DbfFE4348c372);
        registerVoter(0x5c6B0f7Bf3E7ce046039Bd8FABdfD3f9F5021678);
        registerVoter(0x03C6FcED478cBbC9a4FAB34eF9f40767739D1Ff7);

        initiatePropsalsRegistration();
    }

    function TESTresisterProposals() onlyRegisteredVoters public {
        registerProposal("La Proposal de ouf");
        registerProposal("La Proposal de malade");
        registerProposal("La Proposal en or");
        registerProposal("La Proposal hallucinante");
        registerProposal("La Proposal cool");
        registerProposal("La Proposal unique");
        registerProposal("La 7eme Proposal");
    }
} 