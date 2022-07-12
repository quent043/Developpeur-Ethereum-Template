import React, {useState, useEffect, Fragment} from 'react';
import useEth from "../../contexts/EthContext/useEth";
import Title from "./Title";
import * as PropTypes from "prop-types";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
import NoticeNoArtifact from "../Demo/NoticeNoArtifact";
import NoticeWrongNetwork from "../Demo/NoticeWrongNetwork";
import TitleBlock from "./TitleBlock";

//TODO: OnClick chaque assress = détail vote
//TODO: Refactor components
//TODO: Add TU?
//TODO: Proposal List
//TODO: Généraliser Voters Table

const Dashboard = () => {
    const {state: {accounts, contract}} = useEth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isVoter, setIsVoter] = useState(false);
    const [loaded, setLoaded] = useState(false);
    // const [account, setAccount] = useState(false);
    const [workflowStatus, setWorkflowStatus] = useState();
    const [winningProposal, setWinningProposal] = useState();
    const [name, setName] = useState("");

    const init = async () => {
        try {
            setLoaded(false);
            if (contract) {
                let owner = await contract.methods.owner().call({from: accounts[0]});
                if (owner === accounts[0]) {
                    setName("Boss");
                    setIsAdmin(true);
                } else {
                    try {
                        let response = await contract.methods.getVoter(accounts[0]).call({from: accounts[0]});
                        if (response.isRegistered) {
                            setName("User");
                            setIsAdmin(false);
                            setIsVoter(true);
                        } else {
                            setName("");
                            setIsAdmin(false);
                            setIsVoter(false);
                        }
                    } catch (err) {
                        console.log("Quentin - not a voter: ", err);
                        setName("");
                        setIsAdmin(false);
                        setIsVoter(false);
                    }
                }
                listenToWorkflowEvents();
                _getWorkflowStatus();
                setLoaded(true);
            }
        } catch (err) {
            setName("");
            setIsAdmin(false);
            setIsVoter(false);
            console.log("Quentin - err: ", err);
        }
    }

    useEffect(() => {
        init();
    }, [contract, accounts]);

    useEffect(() => {
        isAdmin ? setName("Boss") : setName("User");
    }, [isAdmin]);


    const _getWorkflowStatus = async () => {
        let status = await contract.methods.workflowStatus().call();
        console.log("WF Status ", status);
        setWorkflowStatus(status);
    }

    const getWinningId = async () => {
        if (workflowStatus === "5") {
            let winningProposal = await contract.methods.getWinningProposal().call();
            setWinningProposal(winningProposal);
        }
    }

    const listenToWorkflowEvents = () => {
        contract.events.WorkflowStatusChange().on("data", async (event) => {
            console.log("WF Event ", event.returnValues._newStatus);
            setWorkflowStatus(event.returnValues._newStatus);
        })
    };

    return (
        loaded &&
        <Fragment>
            {(isVoter || isAdmin) &&
                <TitleBlock name={name} isVoter={isVoter} workflowStatus={workflowStatus} />}
            <div className="container">
                {isAdmin &&
                    <AdminDashboard account={accounts[0]} contract={contract}
                                    workflowStatus={workflowStatus}/>}
                {isVoter && <UserDashboard account={accounts[0]} contract={contract} workflowStatus={workflowStatus}/>}
                {(!isVoter && !isAdmin) && <h1>Not a voter</h1>}
                {workflowStatus === "5" && <button className="btn btn-info" onClick={getWinningId}>Get Winning Proposal</button>}
                {winningProposal && <div>Proposal {winningProposal.description} won with {winningProposal.voteCount} votes</div>}
            </div>
        </Fragment>

    );

    // return (
    //     loaded &&
    //     <Fragment>
    //         <Title account={name}/>
    //         <div className="container">
    //             {
    //                 isAdmin ? <AdminDashboard account= {account} contract/> :
    //                     <UserDashboard account= {account} contract/>
    //             }
    //             {workflowStatus === "5" && <button className="btn btn-info" onClick={getWinningId}>Get Winning Proposal</button>}
    //             {winningProposal &&
    //                 <div>Proposal {winningProposal.description} won with {winningProposal.voteCount} votes</div>}
    //         </div>
    //     </Fragment>
    //
    // );
}


export default Dashboard;