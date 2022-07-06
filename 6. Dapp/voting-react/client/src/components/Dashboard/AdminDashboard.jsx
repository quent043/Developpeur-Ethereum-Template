import React from 'react';

import Title from "./Title";
import useEth from "../../contexts/EthContext/useEth";

function AdminDashboard(props) {
    const { state: { artifact, web3, accounts, networkID, contract } } = useEth();


    // Get proposal list ===> Possibility to vote

    return (
        <Title name="Boss"/>
    );
}

export default AdminDashboard;