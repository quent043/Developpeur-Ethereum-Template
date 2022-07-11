import React, {Fragment, useState, useEffect, useRef} from 'react';
import useEth from "../../contexts/EthContext/useEth";

export const ProposalRegistering = (props) => {
    const { state: { artifact, web3, accounts, networkID, contract } } = useEth();
    const proposalDescription = useRef(null);
    const [workflowStatus, setWorkflowStatus] = useState();

    useEffect(() => {
        _getWorkflowStatus();

        return () => {
        };
    }, []);

    const _getWorkflowStatus = async () => {
        let status = await contract.methods.workflowStatus().call();
        setWorkflowStatus(status);
    }
    console.log("WorkFlow", workflowStatus);

    const handleClick = () => {
        _registerProposal(proposalDescription.current.value);
    }

    const _registerProposal = async (description) => {
        console.log(description);
        try {
            await contract.methods.addProposal(description).send({from: accounts[0]});

        } catch (err) {
            console.log(err);
            console.error("Contract Error: ", err.code);
            // setErrorMessage(err.code);
        }
    }

    return (
        <Fragment>
            <div className="container grid-container">
                    <div>
                        <p>WorkFlow status : {workflowStatus}</p>
                    </div>
                    {workflowStatus === "1" && <div>
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
            </div>
        </Fragment>
    );
};