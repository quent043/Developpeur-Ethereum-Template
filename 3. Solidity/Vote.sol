// SPDX-License-Identifier: MIT
pragma solidity 0.8.14;

import"https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

contract Voting is Ownable {

    uint winningProposalId;
    mapping(address => Voter) _voters;
    address[] _registeredAddresses;
    Proposal[] public _proposals;
    WorkflowStatus public _voteState;
    Proposal[] public _secondRoundProposals;
    uint[] public _electedProposalIds;
    uint public maxVotes;

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
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
    event VoteResult (string description);


    constructor() {
        _voteState = WorkflowStatus.RegisteringVoters;
        _proposals.push(Proposal("Blank vote", 0));
    }

    modifier onlyRegisteredVoters() {
        require(_voters[msg.sender].isRegistered, "only registered users are allowed to perform this action.");
        _;
    }

    /*Gardé le winningProposalId privé avec un getter pour que le résultat ne soit consultable qu'au dernier stade du workflow
    Sinon en gardant winningProposalId public, il renvoie par défaut "0" qui est l'id de la première proposal.*/
    function getWinner() external view returns(uint) {
        require(_voteState == WorkflowStatus.VotesTallied, "Voting session still ongoing.");
        return winningProposalId;
    }

    function getDetailedWinningProposal() external view returns(Proposal memory) {
        require(_voteState == WorkflowStatus.VotesTallied, "Voting session still ongoing.");
        return _proposals[winningProposalId];
    }

    function getUserVote(address _address) external view returns(uint) {
        require(_voters[msg.sender].isRegistered || isOwner(), "only registered users or contract owner are allowed to perform this action.");
        require(_voters[_address].hasVoted, "Voter has not voted yet");
        return _voters[_address].votedProposalId;
    }

    //TODO: Change to external
    // function registerVoter(address _address) onlyOwner external {
    function registerVoter(address _address) onlyOwner public {
        require(_voteState == WorkflowStatus.RegisteringVoters, "Registration period ended.");
        require(!_voters[_address].isRegistered, "Voter already registered.");
        _voters[_address].isRegistered = true;
        _registeredAddresses.push(_address);
        emit VoterRegistered(_address);
    }
    //TODO: Change to external et check si ca marche avec calldata
    // function registerProposal(string calldata _description) external onlyRegisteredVoters {
    function registerProposal(string memory _description) public {
        require(_voteState == WorkflowStatus.ProposalsRegistrationStarted, "Proposals registration is not possible at this stage.");
        _proposals.push(Proposal(_description, 0));
        // Cost in gas d'incrémenter un proposal ID en variable d'état vs faire un _proposal.length à chaque event ?
        emit ProposalRegistered(_proposals.length - 1);
    }

    function blankVote () external onlyRegisteredVoters {
        require(_voteState == WorkflowStatus.VotingSessionStarted, "Voting is not possible at this stage.");
        require(!_voters[msg.sender].hasVoted, "Voter has already voted");
        _voters[msg.sender].hasVoted = true;
        _proposals[0].voteCount += 1;
        emit Voted(msg.sender, 0);
    }

    // function voteForProposal(uint _proposalId) external onlyRegisteredVoters {
    function voteForProposal(uint _proposalId) external {
        require(_voteState == WorkflowStatus.VotingSessionStarted, "Voting is not possible at this stage.");
        require(!_voters[msg.sender].hasVoted, "Voter has already voted");
        _voters[msg.sender].hasVoted = true;
        _voters[msg.sender].votedProposalId = _proposalId;
        _proposals[_proposalId].voteCount += 1;
        emit Voted(msg.sender, _proposalId);
    }

    function tallyVotes() external onlyOwner {
        require(_voteState == WorkflowStatus.VotingSessionEnded, "Voting is not possible at this stage.");
        // uint maxVotes;
        // Proposal[] storage _electedProposals;
        // uint[] storage _electedProposalIds;

        //TODO: Manque, reset le ex aequo si plus de vote sur une autre proposal
        for(uint i = 1; i < _proposals.length; i++) {
            if(_proposals[i].voteCount != 0 && _proposals[i].voteCount > maxVotes) {
                maxVotes = _proposals[i].voteCount;
                _electedProposalIds = [i];
            }
            if(_proposals[i].voteCount != 0 && _proposals[i].voteCount == maxVotes) {
                emit VoteResult("tick");
                _electedProposalIds.push(i);
            }
        }

        if(maxVotes == 0) {
            _proposals[0].voteCount = 0;
            resetVotersStatus();
            emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotingSessionStarted);
            emit VoteResult ("Nobody voted for a proposal, voting session reset.");
        }
        else if ( _electedProposalIds.length == 1) {
            winningProposalId = _electedProposalIds[0];
            markVotesAsTallied();
            emit VoteResult ("A Proposal was elected with a majority.");
        }
        else {
            _secondRoundProposals.push(Proposal("Blanc vote", 0));
            for (uint i = 0; i < _electedProposalIds.length; i++) {
                _secondRoundProposals.push(Proposal(_proposals[_electedProposalIds[i]].description, 0));
            }
            _proposals = _secondRoundProposals;
            delete _secondRoundProposals;
            delete _electedProposalIds;
            delete maxVotes;
            resetVotersStatus();
            emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotingSessionStarted);
            emit VoteResult ("There was an ex-aequo in several proposals. Voting session reset with elected proposals only.");
        }
    }

    function resetVotersStatus() private onlyOwner {
        for (uint i = 0; i < _registeredAddresses.length; i++) {
            _voters[_registeredAddresses[i]].hasVoted = false;
        }
        _voteState = WorkflowStatus.VotingSessionStarted;
    }

    /*Workflow state management*/

    // function initiatePropsalsRegistration() onlyOwner external {
    function initiatePropsalsRegistration() onlyOwner public {
        require(_voteState == WorkflowStatus.RegisteringVoters, "Wrong workflow execution order.");
        _voteState = WorkflowStatus.ProposalsRegistrationStarted;
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);
    }

    // function closePrpopsalsRegistration() onlyOwner external {
    function closePrpopsalsRegistration() onlyOwner public {
        require(_voteState == WorkflowStatus.ProposalsRegistrationStarted, "Wrong workflow execution order.");
        _voteState = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);
    }

    // function initiateVotingSession() onlyOwner external {
    function initiateVotingSession() onlyOwner public {
        require(_voteState == WorkflowStatus.ProposalsRegistrationEnded, "Wrong workflow execution order.");
        _voteState = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);
    }

    function closeVotingSession() onlyOwner external {
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

    // SET REGISTERVOTER() TO PUBLIC BEFORE EXECUTING THIS FUNCTION
    function TESTregisterVoters() onlyOwner public {
        registerVoter(0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2);
        registerVoter(0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db);
        registerVoter(0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB);
        registerVoter(0x617F2E2fD72FD9D5503197092aC168c91465E7f2);
        registerVoter(0x17F6AD8Ef982297579C203069C1DbfFE4348c372);
        registerVoter(0x5c6B0f7Bf3E7ce046039Bd8FABdfD3f9F5021678);
        registerVoter(0x03C6FcED478cBbC9a4FAB34eF9f40767739D1Ff7);

        initiatePropsalsRegistration();
        TESTregisterProposals();
        closePrpopsalsRegistration();
        initiateVotingSession();



    }
    // SET REGISTERPROPOSAL() TO PUBLIC BEFORE EXECUTING THIS FUNCTION
    function TESTregisterProposals() public {
        registerProposal("La Proposal de ouf");
        registerProposal("La Proposal de malade");
        registerProposal("La Proposal en or");
        registerProposal("La Proposal hallucinante");
        registerProposal("La Proposal cool");
        registerProposal("La Proposal unique");
        registerProposal("La 7eme Proposal");
    }

}