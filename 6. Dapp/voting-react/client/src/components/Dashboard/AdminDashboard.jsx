import React, {Fragment, useState, useEffect, useRef} from 'react';

import Title from "./Title";
import useEth from "../../contexts/EthContext/useEth";
import WorkflowChanger from "./WorkflowChanger";
import "./Dashboard.css";

function AdminDashboard({account}) {
    const { state: { accounts, contract } } = useEth();
    const [workflowStatus, setWorkflowStatus] = useState();
    const [errorMessage, setErrorMessage] = useState();
    const [winningProposal, setWinningProposal] = useState();
    const inputEthAddress = useRef(null);


    useEffect(() => {
        listenToVoterRegisteredEvent();
        _getWorkflowStatus();

        return () => {
        };
    }, []);

    const _getWorkflowStatus = async () => {
        let status = await contract.methods.workflowStatus().call();
        setWorkflowStatus(status);
    }

    const handleClick = () => {
        _registerVoter(inputEthAddress.current.value);
    }

    const _registerVoter = async (voterAddress) => {
        console.log(voterAddress);
        try {
            await contract.methods.addVoter(voterAddress).send({from: account});

        } catch (err) {
            console.log(err);
            console.error("Contract Error: ", err.code);
            setErrorMessage(err.code);

        }
    }


    const handleWorkflowChange = async (type) => {
        try {
            switch (type) {
                case "INIT_PROPOSAL":
                    await contract.methods.startProposalsRegistering().send({from: account});
                    alert("Proposal registering Initiated");
                    break;
                case "CLOSE_PROPOSAL":
                    await contract.methods.endProposalsRegistering().send({from: account});
                    alert("Ended proposal registration");
                    break;
                case "INIT_VOTE":
                    await contract.methods.startVotingSession().send({from: account});
                    alert("Voting session Initiated");
                    break;
                case "CLOSE_VOTE":
                    await contract.methods.endVotingSession().send({from: account});
                    alert("Ended voting session");
                    break;
                case "TALLY_VOTES":
                    await contract.methods.tallyVotes().send({from: account});
                    alert("Votes tallied");
                    break;

            }
        } catch (err) {
            console.error("Error in workflow change: ", err.code);
            setErrorMessage(err.code);
        }
        finally {
            await _getWorkflowStatus()
        }

    };

    const getWinningId = async () => {
        if (workflowStatus === "5") {
            let winningProposal =  await contract.methods.getWinningProposal().call();
            console.log(winningProposal);
            setWinningProposal(winningProposal);
        }
    }

    const listenToVoterRegisteredEvent = () => {
        contract.events.VoterRegistered().on("data", async (event) => {
            console.log("Event Listener - Voter Registered: ", event)
            alert("Voter " + event + "Successfully added");
        })
    };

    //TODO: ADD KILL LISTENER IN ON DESTROY


    // Get proposal list ===> Possibility to vote
    // Listen to events => Alerts

    return (
        <Fragment>
                <div className="">
                    <div>
                        <p>WorkFlow status : {workflowStatus}</p>
                    </div>

                    {workflowStatus === "0" && <div>
                        <h3>Add a voter:</h3>
                        <div className="input-group mb-3">
                            <input type="text" className="form-control"
                                   ref={inputEthAddress}
                                   placeholder="Voter's ETH Address"
                                   id="ethAddress"
                                   aria-label="Voter's ETH Address"
                                   aria-describedby="basic-addon2"
                            />
                            <div className="input-group-append">
                                <button className="btn btn-outline-secondary" onClick={handleClick}
                                        type="button">Add
                                </button>
                            </div>
                        </div>
                    </div>}
                    {/*<button className="btn btn-info" onClick={_getWorkflowStatus}>GetWorkflowStatus</button>*/}
                </div>
                <div className="input-group mb-3">
                    <WorkflowChanger handleWorkflowChange = {handleWorkflowChange} />
                </div>
                {/*{errorMessage && <div>*/}
                {/*    <p>Error: + {errorMessage}</p>*/}
                {/*</div>}*/}
        </Fragment>
    );
}

export default AdminDashboard;