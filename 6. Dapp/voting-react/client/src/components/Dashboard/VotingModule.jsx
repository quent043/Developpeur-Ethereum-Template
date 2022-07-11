import React, {Fragment, useState, useEffect, useRef} from 'react';
import useEth from "../../contexts/EthContext/useEth";

function VotingModule({account}) {
    const { state: { accounts, contract } } = useEth();
    const proposalId = useRef(null);
    const [workflowStatus, setWorkflowStatus] = useState();
    const [voter, setVoter] = useState();

    useEffect(() => {
        _getWorkflowStatus();
        _getVoter();
        listenToVoterRegisteredEvent();
        return () => {
        };
    }, []);

    const _getWorkflowStatus = async () => {
        try {
            let status = await contract.methods.workflowStatus().call();
            setWorkflowStatus(status);
        } catch (err) {
            console.error(err.code);
        }
    }

    const _getVoter = async () => {
        try {
            console.log(await contract.methods);
            console.log(account);
            let voter = await contract.methods.getVoter(account).call();
            setWorkflowStatus("Quentin voter: ", voter);
        } catch (err) {
            console.error(err);
        }
    }
    console.log("WorkFlow", workflowStatus);

    const handleClick = () => {
        _registerProposal(proposalId.current.value);
    }

    const _registerProposal = async (id) => {
        console.log(id);
        try {
            await contract.methods.setVote(id).send({from: accounts[0]});

        } catch (err) {
            console.log(err);
            console.error("Contract Error: ", err.code);
            // setErrorMessage(err.code);
        }
    }

    const listenToVoterRegisteredEvent = () => {
        contract.events.Voted().on("data", async (event) => {
            console.log("Event Listener - Voted : ", event)
            // alert("Voter " + event + "Successfully added");
        })
    };

    return (
        <Fragment>
            <div className="container grid-container">
                <div>
                    <h3>Vote for a proposal:</h3>
                    <p>WorkFlow status : {workflowStatus}</p>
                </div>
                <div className="input-group mb-3">
                    <input type="number" className="form-control"
                           ref={proposalId}
                           placeholder="Vote Id"
                           id="description"
                           aria-label="Vote Id"
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
        </Fragment>
    );
}

export default VotingModule;
