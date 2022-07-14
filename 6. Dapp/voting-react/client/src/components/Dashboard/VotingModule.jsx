import React, {Fragment} from 'react';
import {toast} from "react-toastify";

function VotingModule({account, contract, proposals, voter, updateVoter}) {
    const handleClick = async (proposalId) => {
        await handleRegisterProposal(proposalId);
    }

    const handleRegisterProposal = async (proposalId) => {
        try {
            await contract.methods.setVote(proposalId).send({from: account});
            updateVoter()
            toast.success("You successfully voted for proposal " + proposalId)
        } catch (err) {
            toast.error("Error connecting to the blockchain");
        }
    }

    return (
        <Fragment>
            {!voter.hasVoted && <h3 className="text-center">Please vote for one of the following proposals</h3>}
            {voter.hasVoted && <h3 className="text-center">Thank you for voting - You voted for proposal {voter.votedProposalId}</h3>}
            <div className="proposals-container">
                {proposals.map((proposal, index) => (
                    <div key={index} className="card proposal-card m-3">
                        <div className="proposal-card-title card-header">Proposal {index}</div>
                        <div className="card-body">
                            <p className="card-text">{proposal}</p>
                            <button disabled={voter.hasVoted} onClick={ ()=> { handleClick(index) } } className="btn btn-primary voting-btn">Vote</button>
                        </div>
                    </div>
                ))}
            </div>
        </Fragment>
    );
}

export default VotingModule;
