import React, { useState, useEffect } from 'react';
import useEth from "../../contexts/EthContext/useEth";
import Title from "./Title";
import * as PropTypes from "prop-types";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
import NoticeNoArtifact from "../Demo/NoticeNoArtifact";
import NoticeWrongNetwork from "../Demo/NoticeWrongNetwork";


const Dashboard = () => {
    const { state: { artifact, web3, accounts, networkID, contract } } = useEth();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loaded, setloaded] = useState(false);

    const checkAdmin = async () => {
        setloaded(false);
        await contract.methods.owner().call({from: accounts[0]}) === accounts[0] ? setIsAdmin(true) : setIsAdmin(false);
        console.log("Quentin - isAdmin: ",isAdmin);
        setloaded(true);
    }

    useEffect( () => {
        checkAdmin();
    }, [contract, accounts])

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
        loaded && <div className="dashboard">
            {
                isAdmin ? <AdminDashboard /> : <UserDashboard name = {accounts[0]}/>
            }
        </div>
    );
}


export default Dashboard;