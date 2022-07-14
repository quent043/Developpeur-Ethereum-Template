import React, {useRef} from 'react';
import Table from "./Table";

export const ProposalRegistering = ({workflowStatus, proposals, handleRegisterProposal}) => {
    const proposalDescription = useRef(null);

    const handleClick = () => {
        handleRegisterProposal(proposalDescription.current.value);
        proposalDescription.current.value = "";
    }

    return (
        <div className="flex-container">
            {workflowStatus === "1" &&
                <div className="add-proposal">
                    <h3>Add a Proposal:</h3>
                    <div className="input-group mb-3">
                        <input type="text" className="form-control"
                               ref={proposalDescription}
                               placeholder="Proposal Description"
                               id="description"
                               aria-label="Proposal Description"
                               aria-describedby="basic-addon2"
                        />
                        <div className="input-group-append">
                            <button className="btn btn-primary input-add-button"
                                    onClick={handleClick}
                                    type="button">Add
                            </button>
                        </div>
                    </div>

                </div>}
            {proposals && (proposals.length !== 0) &&
                <Table items={proposals} title="Proposals:"
                       style="proposals-table"/>}
        </div>
    );
};