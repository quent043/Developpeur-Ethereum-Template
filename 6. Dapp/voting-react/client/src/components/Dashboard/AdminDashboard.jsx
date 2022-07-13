import React, {useState, useEffect, useRef} from 'react';

import WorkflowChanger from "./WorkflowChanger";
import "./Dashboard.css";
import Table from "./Table";
import AddVoters from "./AddVoters";
import {toast} from "react-toastify";

function AdminDashboard({account, workflowStatus, contract}) {
    const [errorMessage, setErrorMessage] = useState();
    const [winningProposal, setWinningProposal] = useState();
    const [voters, setVoters] = useState();
    const inputEthAddress = useRef(null);


    useEffect(() => {
        getVoters();
        return () => {
        };
    }, []);


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

    const toastOptions = {
        closeOnClick: true,
        closeOnHover: true,
        autoClose: 2000
    }

    const handleWorkflowChange = async (type) => {
        try {
            switch (type) {
                case "INIT_PROPOSAL":
                    await contract.methods.startProposalsRegistering().send({from: account});
                    toast.success("Proposal registering Initiated");
                    break;
                case "CLOSE_PROPOSAL":
                    await contract.methods.endProposalsRegistering().send({from: account});
                    toast.success("Ended proposal registration", toastOptions);
                    break;
                case "INIT_VOTE":
                    await contract.methods.startVotingSession().send({from: account});
                    toast.success("Voting session Initiated");
                    break;
                case "CLOSE_VOTE":
                    await contract.methods.endVotingSession().send({from: account});
                    toast.success("Ended voting session");
                    break;
                case "TALLY_VOTES":
                    await contract.methods.tallyVotes().send({from: account});
                    toast.success  ("Votes tallied");
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
        console.log(voters.length === 0)
    }


    return (
        <div className="flex-container">
            <WorkflowChanger handleWorkflowChange = {handleWorkflowChange} workflowStatus = {workflowStatus} />
            {workflowStatus === "0" && <AddVoters handleClick = {handleClick} />}
            {voters && (voters.length !== 0) && <Table style={"voter-table flex-item-align-top"} items={voters} title="Registered Voters"/>}
        </div>
    );
}

export default AdminDashboard;