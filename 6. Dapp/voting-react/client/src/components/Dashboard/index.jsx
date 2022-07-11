import React, {useState, useEffect, Fragment} from 'react';
import useEth from "../../contexts/EthContext/useEth";
import Title from "./Title";
import * as PropTypes from "prop-types";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
import NoticeNoArtifact from "../Demo/NoticeNoArtifact";
import NoticeWrongNetwork from "../Demo/NoticeWrongNetwork";


const Dashboard = () => {
    const {state: {accounts, contract}} = useEth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [account, setAccount] = useState(false);
    const [workflowStatus, setWorkflowStatus] = useState();
    const [winningProposal, setWinningProposal] = useState();
    const [name, setName] = useState("");

    const init = async () => {
        setLoaded(false);
        if (contract) {
            await contract.methods.owner().call({from: accounts[0]}) === accounts[0] ? setIsAdmin(true) : setIsAdmin(false);
            setAccount(accounts[0]);
            listenToWorkflowEvents();
            _getWorkflowStatus();
            setLoaded(true);
        }
    }

    useEffect(() => {
        init();

    }, [contract, accounts]);

    useEffect(() => {
        isAdmin ? setName("Boss") : setName("User");

    }, [isAdmin]);


    const _getWorkflowStatus = async () => {
        console.log("Check")
        let status = await contract.methods.workflowStatus().call();
        setWorkflowStatus(status);
    }

    const getWinningId = async () => {
        if (workflowStatus === "5") {
            let winningProposal =  await contract.methods.getWinningProposal().call();
            console.log(winningProposal);
            setWinningProposal(winningProposal);
        }
    }

    const listenToWorkflowEvents = () => {
        // console.log("Quentin listener in index activated")
        contract.events.WorkflowStatusChange().on("data", async (event) => {
            // console.log("Event Listener - Index WorkFlowStatus: ", event)
            setWorkflowStatus(event);
        })
    };

    return (
        loaded &&
            <Fragment>
                <Title account={name}/>
                <div className="container">
                    {
                        isAdmin ? <AdminDashboard account= {account} contract/> :
                            <UserDashboard account= {account} contract/>
                    }
                    {workflowStatus === "5" && <button className="btn btn-info" onClick={getWinningId}>Get Winning Proposal</button>}
                    {winningProposal &&
                        <div>Proposal {winningProposal.description} won with {winningProposal.voteCount} votes</div>}
                </div>
            </Fragment>

    );
}


export default Dashboard;