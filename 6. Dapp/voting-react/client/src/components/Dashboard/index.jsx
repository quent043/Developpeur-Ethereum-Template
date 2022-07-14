import React, {useState, useEffect} from 'react';
import useEth from "../../contexts/EthContext/useEth";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
import TitleBlock from "./TitleBlock";
import WinningProposalButton from "./WinningProposalButton";
import NotAVoterPage from "./NotAVoterPage";
import {toast} from "react-toastify";

const Dashboard = () => {
    const {state: {accounts, contract}} = useEth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isVoter, setIsVoter] = useState(false);
    const [voter, setVoter] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [workflowStatus, setWorkflowStatus] = useState();
    const [name, setName] = useState("");

    const setAdminProfile = () => {
        setName("Boss");
        setIsAdmin(true);
    }

    const setVoterProfile = (voter) => {
        setVoter(voter);
        setName("Voter");
        setIsAdmin(false);
        setIsVoter(true);
    }

    const setNonVoterProfile = () => {
        setName("");
        setIsAdmin(false);
        setIsVoter(false);
    }

    const getVoter = () => {
        return contract.methods.getVoter(accounts[0]).call({from: accounts[0]});
    }

    const updateVoter = async () => {
        setVoter(await contract.methods.getVoter(accounts[0]).call({from: accounts[0]}));
    }

    const init = async () => {
        try {
            setLoaded(false);
            if (contract) {
                let owner = await contract.methods.owner().call({from: accounts[0]});
                if (owner === accounts[0]) {
                    setAdminProfile();
                } else {
                    try {
                        let voter = await getVoter();
                        if (voter.isRegistered) {
                            setVoterProfile(voter);
                        } else {
                            setNonVoterProfile();
                        }
                    } catch (err) {
                        setNonVoterProfile()
                    }
                }
                listenToWorkflowEvents();
                // listenToVotingEvents();
                await getWorkflowStatus();
                setLoaded(true);
            }
        } catch (err) {
            setNonVoterProfile();
            toast.error("Error connecting to the blockchain")
        }
    }

    useEffect(() => {
        init();
    }, [contract, accounts]);

    const getWorkflowStatus = async () => {
        try {
            let status = await contract.methods.workflowStatus().call();
            setWorkflowStatus(status);
        } catch (err) {
            toast.error("Error connecting to the blockchain");
        }
    }

    const listenToWorkflowEvents = () => {
        contract.events.WorkflowStatusChange().on("data", async (event) => {
            setWorkflowStatus(event.returnValues._newStatus);
        })
    };

    // const listenToVotingEvents = () => {
    //     contract.events.Voted().on("data", async () => {
    //         try {
    //             let response = await getVoter();
    //             setVoter(response);
    //         } catch (err) {
    //             console.log("voter listener")
    //             toast.error("Error connecting to the blockchain");
    //         }
    //     })
    // };

    return (
        loaded &&
        <div className="title-block-background container">
            {(isVoter || isAdmin) &&
                <TitleBlock name={name} isVoter={isVoter} workflowStatus={workflowStatus} />}
            <div className="container">
                {isAdmin && <AdminDashboard account={accounts[0]} contract={contract} workflowStatus={workflowStatus}/>}
                {(isVoter && !isAdmin) && <UserDashboard account={accounts[0]} contract={contract} workflowStatus={workflowStatus} voter={voter} updateVoter={updateVoter} />}
                {(!isVoter && !isAdmin) && <NotAVoterPage />}
                <WinningProposalButton workflowStatus={workflowStatus} contract={contract} />
            </div>
        </div>

    );
}


export default Dashboard;