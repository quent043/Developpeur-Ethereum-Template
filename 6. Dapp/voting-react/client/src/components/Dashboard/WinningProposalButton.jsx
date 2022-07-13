import React, {useState} from 'react';

function WinningProposalButton({workflowStatus, contract}) {
    const [winningProposal, setWinningProposal] = useState();

    const getWinningId = async () => {
        if (workflowStatus === "5") {
            let winningProposal = await contract.methods.getWinningProposal().call();
            setWinningProposal(winningProposal);
        }
    }

    return (
        <div className="title-block">
            {workflowStatus === "5" &&
                <button className="btn btn-info btn-winner" onClick={getWinningId}>Get Winning Proposal</button>}
            {winningProposal && <h3>Proposal {winningProposal.description} won with {winningProposal.voteCount} votes</h3>}
        </div>
    );
}

export default WinningProposalButton;
