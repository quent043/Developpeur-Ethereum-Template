import React, {Fragment, useState, useEffect, useRef} from 'react';
import Table from "./Table";

export const ProposalRegistering = ({account, contract, workflowStatus, proposals, handleRegisterProposal}) => {
    const proposalDescription = useRef(null);

    const handleClick = () => {
        handleRegisterProposal(proposalDescription.current.value);
    }


    // const [proposals, setProposals] = useState([]);
    //
    // useEffect(() => {
    //     return () => {
    //         getProposalEvents();
    //     };
    // }, []);
    //
    //
    // const handleClick = () => {
    //     _registerProposal(proposalDescription.current.value);
    // }
    //
    // const _registerProposal = async (description) => {
    //     try {
    //         await contract.methods.addProposal(description).send({from: account});
    //         getProposalEvents();
    //     } catch (err) {
    //         console.log(err);
    //         console.error("Contract Error: ", err.code);
    //         // setErrorMessage(err.code);
    //     }
    // }
    //
    // const getProposalEvents = async () => {
    //     let options = {
    //         fromBlock: 0,
    //         toBlock: "latest"
    //     }
    //
    //     const contractEvents = await contract.getPastEvents("ProposalRegistered",  options);
    //     console.log("Contract Events - ProposalRegistering: ", contractEvents);
    //     let proposalsIds = [];
    //     contractEvents.forEach(element => {
    //
    //         proposalsIds.push(element.returnValues._proposalId);
    //     });
    //
    //     let proposals = [];
    //     for (const proposalId of proposalsIds) {
    //         const proposal = await contract.methods.getOneProposal(proposalId).call({from: account});
    //         proposals.push(proposal.description);
    //     }
    //     console.log("Proposals - ProposalRegistering ", proposals);
    //     setProposals(proposals);
    //
    // }

    return (
        <div className="flex-container">
            {/*<div className="container flex-container">*/}
                {workflowStatus === "1" &&
                    <div className="add-proposal">
                        <h3>Add a Proposal:</h3>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control"
                                   ref={proposalDescription}
                                   placeholder="Proposal Description"
                                   id="description"
                                   aria-label="Proposal Description"
                                   aria-describedby="basic-addon2"
                            />
                            <div className="input-group-append">
                                <button className="btn btn-outline-secondary"
                                        onClick={handleClick}
                                        type="button">Add
                                </button>
                            </div>
                        </div>

                    </div>}
            {proposals && (proposals.length !== 0) && <Table items={proposals} title="Proposals:" style="proposals-table"/>}

            {/*</div>*/}
        </div>
    );
};