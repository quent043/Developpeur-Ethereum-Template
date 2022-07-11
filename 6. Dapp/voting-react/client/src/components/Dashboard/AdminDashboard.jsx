import React, {Fragment, useState, useEffect, useRef} from 'react';

import Title from "./Title";
import useEth from "../../contexts/EthContext/useEth";
import WorkflowChanger from "./WorkflowChanger";
import "./Dashboard.css";

function AdminDashboard(props) {
    const { state: { artifact, web3, accounts, networkID, contract } } = useEth();
    const [workflowStatus, setWorkflowStatus] = useState();
    const [errorMessage, setErrorMessage] = useState();
    const inputEthAddress = useRef(null);


    useEffect(() => {
        listenToVoterRegisteredEvent();
        return () => {
        };
    }, [workflowStatus]);

    const _getWorkflowStatus = async () => {
        let status = await contract.methods.workflowStatus().call();
        setWorkflowStatus(status);
        console.log(workflowStatus);
    }

    const handleClick = () => {
        _registerVoter(inputEthAddress.current.value);
    }

    const _registerVoter = async (voterAddress) => {
        console.log(voterAddress);
        try {
            await contract.methods.addVoter(voterAddress).send({from: accounts[0]});

        } catch (err) {
            console.log(err);
            console.error("Contract Error: ", [err]);
            setErrorMessage(err.code);

        }
    }

    const handleWorkflowChange = async (type) => {
        try {
            switch (type) {
                case "INIT_PROPOSAL":
                    await contract.methods.startProposalsRegistering().send({from: accounts[0]});
                    alert("Proposal registering Initiated");
                    break;
                case "CLOSE_PROPOSAL":
                    await contract.methods.endProposalsRegistering().send({from: accounts[0]});
                    alert("Ended proposal registration");
                    break;
                case "INIT_VOTE":
                    await contract.methods.startVotingSession().send({from: accounts[0]});
                    alert("Voting session Initiated");
                    break;
                case "CLOSE_VOTE":
                    await contract.methods.endVotingSession().send({from: accounts[0]});
                    alert("Ended voting session");
                    break;
                case "TALLY_VOTES":
                    await contract.methods.tallyVotes().send({from: accounts[0]});
                    alert("Votes tallied");
                    break;

            }
        } catch (err) {
            console.error("Error in workflow change: ", err);
            setErrorMessage(err);
        }
        finally {
            await _getWorkflowStatus()
        }

    };

    const listenToVoterRegisteredEvent = () => {
        console.log("Quentin listener Vote Register in Dashboard admin activated")
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
            <Title name="Boss"/>
            <div className="container grid-container">
                <div className="">
                    <div>
                        <p>WorkFlow status : {workflowStatus}</p>
                    </div>

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
                    <button className="btn btn-info" onClick={_getWorkflowStatus}>GetWorkflowStatus</button>
                </div>
                <div className="">
                    <WorkflowChanger handleWorkflowChange = {handleWorkflowChange} />
                </div>
                {errorMessage && <div>
                    <p>Error: + {errorMessage}</p>
                </div>}

            </div>


        </Fragment>
);
}

export default AdminDashboard;