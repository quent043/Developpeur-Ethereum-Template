import React, {useState, useEffect, Fragment} from 'react';
import useEth from "../../contexts/EthContext/useEth";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
import TitleBlock from "./TitleBlock";
import WinningProposalButton from "./WinningProposalButton";
import NotAVoterPage from "./NotAVoterPage";

//TODO: OnClick chaque assress = détail vote
//TODO: Refactor components
//TODO: Add TU?
//TODO: Check si le owner est aussi voter

const Dashboard = () => {
    const {state: {accounts, contract}} = useEth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isVoter, setIsVoter] = useState(false);
    const [voter, setVoter] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [workflowStatus, setWorkflowStatus] = useState();
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
                        let voter = await contract.methods.getVoter(accounts[0]).call({from: accounts[0]});
                        if (voter.isRegistered) {
                            setVoter(voter);
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
                listenToVotingEvents();
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
        setWorkflowStatus(status);
    }

    const listenToWorkflowEvents = () => {
        contract.events.WorkflowStatusChange().on("data", async (event) => {
            setWorkflowStatus(event.returnValues._newStatus);
        })
    };

    const listenToVotingEvents = () => {
        contract.events.Voted().on("data", async (event) => {
            let response = await contract.methods.getVoter(accounts[0]).call({from: accounts[0]});
            setVoter(response);
        })
    };

    return (
        loaded &&
        <Fragment>
            {(isVoter || isAdmin) &&
                <TitleBlock name={name} isVoter={isVoter} workflowStatus={workflowStatus} />}
            <div className="container">
                {isAdmin && <AdminDashboard account={accounts[0]} contract={contract} workflowStatus={workflowStatus}/>}
                {(isVoter && !isAdmin) && <UserDashboard account={accounts[0]} contract={contract} workflowStatus={workflowStatus} voter={voter} />}
                {(!isVoter && !isAdmin) && <NotAVoterPage />}
                <WinningProposalButton workflowStatus={workflowStatus} contract={contract} />
            </div>
        </Fragment>

    );
}


export default Dashboard;