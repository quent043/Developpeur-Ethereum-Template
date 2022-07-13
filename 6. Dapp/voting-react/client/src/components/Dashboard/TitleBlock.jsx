import React, {useState, useEffect, Fragment} from 'react';
import Title from "./Title";
import {WorkflowStatus} from './WorkflowChanger';

function TitleBlock({name, isVoter, workflowStatus}) {
    const [workflowName, setWorkflowName] = useState();

    useEffect(() => {
        renderWorkflowStatus();
    }, [workflowStatus, workflowName])

    const renderWorkflowStatus = () => {
        switch (workflowStatus) {
            case "0":
                setWorkflowName("Registering Voters")
                break
            case "1":
                setWorkflowName("Registering Proposals")
                break
            case "2":
                setWorkflowName("Closed Proposal Registering")
                break
            case "3":
                setWorkflowName("Voting Session Started")
                break
            case "4":
                setWorkflowName("Closed Voting Session")
                break
            case "5":
                setWorkflowName("Votes Tallied")
                break
        }


    }
    return (
        <div className="title-block">
            <Title name={name} isVoter={{isVoter}}/>
            <div>
                <h2 className={"box"}>WorkFlow status: {workflowName}</h2>
            </div>
        </div>
    );
}

export default TitleBlock;