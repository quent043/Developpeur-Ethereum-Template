import React, {Fragment, useState, useEffect, useRef} from 'react';
import useEth from "../../contexts/EthContext/useEth";
import {Button} from "react-bootstrap";

const WorkflowChanger = ({ handleWorkflowChange }) => {
const WorkflowStatus = {
    0 : "INIT_PROPOSAL",
    1 : "CLOSE_PROPOSAL",
    2 : "INIT_VOTE",
    3 : "CLOSE_VOTE",
    4 : "TALLY_VOTES",
    }


    return (
            <div className="d-grid gap-2">
                <Button variant="primary" size="lg" onClick={() => handleWorkflowChange(WorkflowStatus[0])}>
                    Init Proposal Registration
                </Button>
                <Button variant="primary" size="lg" onClick={() => handleWorkflowChange(WorkflowStatus[1])}>
                    Close Proposal Registration
                </Button>
                <Button variant="primary" size="lg" onClick={() => handleWorkflowChange(WorkflowStatus[2])}>
                    Init Voting Session
                </Button>
                <Button variant="primary" size="lg" onClick={() => handleWorkflowChange(WorkflowStatus[3])}>
                    Close Voting Session
                </Button>
                <Button variant="primary" size="lg" onClick={() => handleWorkflowChange(WorkflowStatus[4])}>
                    Tally Votes
                </Button>
            </div>
    );
};

export default WorkflowChanger;
