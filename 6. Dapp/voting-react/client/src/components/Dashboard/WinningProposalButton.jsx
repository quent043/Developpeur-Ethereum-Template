import React, {useState} from 'react';

function WinningProposalButton({workflowStatus, contract}) {
    const [winningProposal, setWinningProposal] = useState();
    const [errorMessage, setErrorMessage] = useState(null);

    const getWinningId = async () => {
        if (workflowStatus === "5") {
            try {
                let winningProposal = await contract.methods.getWinningProposal().call();
                console.log(winningProposal);
                setWinningProposal(winningProposal);
                setErrorMessage(null);
            } catch (err) {
                console.log("Err ", err)
                setWinningProposal(null);
                setErrorMessage("Nobody voted, no proposal won");
            }
        }
    }

    return (
        <div className="title-block">
            {workflowStatus === "5" &&
                <button className="btn btn-info btn-winner" onClick={getWinningId}>Get Winning Proposal</button>}
            {winningProposal && <h3>Proposal {winningProposal.description} won with {winningProposal.voteCount} votes</h3>}
            {errorMessage && <h3>{errorMessage}</h3>}
        </div>
    );
}

export default WinningProposalButton;
