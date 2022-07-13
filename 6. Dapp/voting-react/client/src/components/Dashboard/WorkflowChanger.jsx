import React from 'react';
import {Button} from "react-bootstrap";

export const WorkflowStatus = {
    0 : "INIT_PROPOSAL",
    1 : "CLOSE_PROPOSAL",
    2 : "INIT_VOTE",
    3 : "CLOSE_VOTE",
    4 : "TALLY_VOTES",
}

const WorkflowChanger = ({ handleWorkflowChange, workflowStatus }) => {

    return (
            <div className="workflow-manager flex-column flex-container">
                <h2>Workflow Manager</h2>
                <Button disabled={workflowStatus !== "0"} variant="primary" size="lg" onClick={() => handleWorkflowChange(WorkflowStatus[0])}>
                    Init Proposal Registration
                </Button>
                <Button disabled={workflowStatus !== "1"} variant="primary" size="lg" onClick={() => handleWorkflowChange(WorkflowStatus[1])}>
                    Close Proposal Registration
                </Button>
                <Button disabled={workflowStatus !== "2"} variant="primary" size="lg" onClick={() => handleWorkflowChange(WorkflowStatus[2])}>
                    Init Voting Session
                </Button>
                <Button disabled={workflowStatus !== "3"} variant="primary" size="lg" onClick={() => handleWorkflowChange(WorkflowStatus[3])}>
                    Close Voting Session
                </Button>
                <Button disabled={workflowStatus !== "4"} variant="primary" size="lg" onClick={() => handleWorkflowChange(WorkflowStatus[4])}>
                    Tally Votes
                </Button>
            </div>
    );
};

export default WorkflowChanger;
