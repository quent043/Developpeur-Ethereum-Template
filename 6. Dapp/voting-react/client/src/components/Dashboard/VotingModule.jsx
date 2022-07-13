import React, {Fragment, useState, useEffect, useRef} from 'react';
import Table from "./Table";

function VotingModule({account, contract, proposals, voter}) {

    useEffect(() => {
        console.log(voter)
        return () => {
        };
    }, []);


    const handleClick = (proposalId) => {
        _registerProposal(proposalId);
    }

    const _registerProposal = async (id) => {
        console.log(id);
        try {
            let response = await contract.methods.setVote(id).send({from: account});
            console.log("Quentin response: ",response.events.voted);
        } catch (err) {
            console.log(err);
            console.error("Contract Error: ", err.code);
            // setErrorMessage(err.code);
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
                            <p className="card-text">{proposal}.</p>
                            <button disabled={voter.hasVoted} onClick={ ()=> { handleClick(index) } } className="btn btn-primary voting-btn">Vote</button>
                        </div>
                    </div>
                ))}

            </div>
        </Fragment>
    );
}

export default VotingModule;
