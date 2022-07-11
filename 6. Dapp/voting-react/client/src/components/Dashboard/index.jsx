import React, {useState, useEffect} from 'react';
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
    const [workflowStatus, setWorkflowStatus] = useState();

    const init = async () => {
        setLoaded(false);
        if (contract) {
            await contract.methods.owner().call({from: accounts[0]}) === accounts[0] ? setIsAdmin(true) : setIsAdmin(false);
            // console.log("Quentin owner: ", await contract.methods.owner().call({from: accounts[0]}));
            // console.log("Quentin account[0]: ", accounts[0]);
            listenToWorkflowEvents();
            setLoaded(true);
        }
    }

    useEffect(() => {
        init();
    }, [contract, accounts]);


    const listenToWorkflowEvents = () => {
        console.log("Quentin listener in index activated")
            contract.events.WorkflowStatusChange().on("data", async (event) => {
                console.log("Event Listener - Index WorkFlowStatus: ", event)
                setWorkflowStatus(event);
            })
    };

// return (
//     {isAdmin &&
//     <div className="dashboard">
//         <Title name="Boss"/>
//         <AdminDashboard/>
//     </div>
//     accounts &&
//     <div className="dashboard">
//         <Title name={accounts[0]}/>
//         <UserDashboard/>
//     </div>
// }
//     )

    // if(isAdmin) return (
    //     <div className="dashboard">
    //         <Title name = "Boss"/>
    //         <AdminDashboard />
    //     </div>
    // )
    //     else {
    //         return (
    //     <div className="dashboard">
    //         <Title name={accounts[0]}/>
    //         <UserDashboard/>
    //     </div>
    //         )
    // }

    return (
        loaded && <div>
            {
                isAdmin ? <AdminDashboard accounts contract/> :
                    <UserDashboard name={accounts[0]}/>
            }
        </div>
    );
}


export default Dashboard;