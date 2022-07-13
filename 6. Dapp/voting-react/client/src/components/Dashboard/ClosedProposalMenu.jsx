import React from 'react';
import Table from "./Table";

function ClosedProposalMenu({proposals}) {

    return (
        <div className="title-block">
            <h2>Thank you for registering proposals, Voting will begin shortly...</h2>

            {proposals && (proposals.length !== 0) && <Table items={proposals} title="Submitted proposals" style="proposals-table-centered"/>}

        </div>
    );
}

export default ClosedProposalMenu;