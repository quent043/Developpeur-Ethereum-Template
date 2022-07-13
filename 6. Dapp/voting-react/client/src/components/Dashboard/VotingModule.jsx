import React, {Fragment, useState, useEffect, useRef} from 'react';
import Table from "./Table";

function VotingModule({account, contract, workflowStatus, proposals, voter}) {

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
            await contract.methods.setVote(id).send({from: account});
        } catch (err) {
            console.log(err);
            console.error("Contract Error: ", err.code);
            // setErrorMessage(err.code);
        }
    }


    return (
        <Fragment>
        {voter.hasVoted && <h3 className="text-center">Thank you for voting</h3>}
        <div className="proposals-container">
            {/*<h3>Vote for a proposal:</h3>*/}
            {/*    <div className="">*/}
            {/*        <input type="number" className="form-control"*/}
            {/*               ref={proposalId}*/}
            {/*               placeholder="Vote Id"*/}
            {/*               id="description"*/}
            {/*               aria-label="Vote Id"*/}
            {/*               aria-describedby="basic-addon2"*/}
            {/*        />*/}
            {/*        <div className="input-group-append">*/}
            {/*            <button className="btn btn-outline-secondary"*/}
            {/*                    onClick={handleClick}*/}
            {/*                    type="button">Vote*/}
            {/*            </button>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    {proposals && (proposals.length !== 0) && <Table items={proposals} title="Submitted proposals" style="proposals-table-centered"/>}*/}

            {proposals.map((proposal, index) => (
                <div key={index} className="card proposal-card">
                    <div className="card-body">
                        <h5 className="card-title proposal-card-title">Proposal {index}</h5>
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
