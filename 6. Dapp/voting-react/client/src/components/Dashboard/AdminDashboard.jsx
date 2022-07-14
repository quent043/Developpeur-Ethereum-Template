import React, {useState, useEffect} from 'react';

import WorkflowChanger from "./WorkflowChanger";
import "./Dashboard.css";
import Table from "./Table";
import AddVoters from "./AddVoters";
import {toast} from "react-toastify";

function AdminDashboard({account, workflowStatus, contract}) {
    const [voters, setVoters] = useState();


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
            toast.success("Voter successfully registered");
            getVoters();
        } catch (err) {
            toast.error("Error connecting to the blockchain");
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
            toast.error("Error in workflow change: ", err.code);
        }
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
        <div className="flex-container">
            <WorkflowChanger handleWorkflowChange = {handleWorkflowChange} workflowStatus = {workflowStatus} />
            {workflowStatus === "0" && <AddVoters handleClick = {handleClick} />}
            {voters && (voters.length !== 0) && <Table style={"voter-table flex-item-align-top"} items={voters} title="Registered Voters"/>}
        </div>
    );
}

export default AdminDashboard;