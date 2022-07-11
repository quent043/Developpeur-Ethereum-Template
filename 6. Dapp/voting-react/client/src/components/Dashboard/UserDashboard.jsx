import React, {Fragment, useEffect, useState} from 'react';
import Title from "./Title";
import {ProposalRegistering} from "./ProposalRegistering";
import useEth from "../../contexts/EthContext/useEth";
import VotingModule from "./VotingModule";

function UserDashboard({account}) {
    const { state: { accounts, contract } } = useEth();
    const [workflowStatus, setWorkflowStatus] = useState();

    useEffect(() => {
        _getWorkflowStatus();

        return () => {
        };
    }, []);

    const _getWorkflowStatus = async () => {
        let status = await contract.methods.workflowStatus().call();
        setWorkflowStatus(status);
    }
//TODO Tenter ici la même logique que "index". On met ici
    return (
        <Fragment>
            {workflowStatus === "1" && <ProposalRegistering contract account ={account}/>}
            {workflowStatus === "3" && <VotingModule account ={account}/>}
        </Fragment>
    );
}

export default UserDashboard;