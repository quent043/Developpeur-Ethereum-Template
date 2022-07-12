import React, {Fragment, useState, useEffect, useRef} from 'react';

import WorkflowChanger from "./WorkflowChanger";
import "./Dashboard.css";
import Table from "./Table";
import AddVoters from "./AddVoters";

function AdminDashboard({account, workflowStatus, contract}) {
    const [errorMessage, setErrorMessage] = useState();
    const [winningProposal, setWinningProposal] = useState();
    const [voters, setVoters] = useState([""]);
    const inputEthAddress = useRef(null);


    useEffect(() => {
        getVoters();
        // _getWorkflowStatus();
        return () => {
        };
    }, []);

    // const _getWorkflowStatus = async () => {
    //     let status = await contract.methods.workflowStatus().call();
    //     setWorkflowStatus(status);
    // }

    const handleClick = (data) => {
        _registerVoter(data);
    }

    const _registerVoter = async (voterAddress) => {
        try {
            await contract.methods.addVoter(voterAddress).send({from: account});
            getVoters();

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
            // await _getWorkflowStatus()
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

    const getVoters = async () => {
        let options = {
            fromBlock: 0,
            toBlock: "latest"
        }

        const contractEvents = await contract.getPastEvents("VoterRegistered",  options);
        let voters = [];
        contractEvents.forEach(element => {
            voters.push(element.returnValues._voterAddress);
        });
        setVoters(voters);
    }


    return (
        <Fragment>
            {workflowStatus === "0" && <AddVoters handleClick = {handleClick} />}
            <WorkflowChanger handleWorkflowChange = {handleWorkflowChange} workflowStatus = {workflowStatus} />
            {voters && <Table items={voters} title="Registered Voters"/>}
        </Fragment>
    );
}

export default AdminDashboard;