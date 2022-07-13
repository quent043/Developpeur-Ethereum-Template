import React from 'react';

function ClosedVotingSession() {
    // const [proposals, setProposals] = useState([]);
    //
    // useEffect(() => {
    //     return () => {
    //         getProposalEvents();
    //     };
    // }, []);
    //
    // const getProposalEvents = async () => {
    //     let options = {
    //         fromBlock: 0,
    //         toBlock: "latest"
    //     }
    //
    //     const contractEvents = await contract.getPastEvents("ProposalRegistered",  options);
    //     console.log("Contract Events - ProposalRegistering: ", contractEvents);
    //     let proposalsIds = [];
    //     contractEvents.forEach(element => {
    //
    //         proposalsIds.push(element.returnValues._proposalId);
    //     });
    //
    //     let proposals = [];
    //     for (const proposalId of proposalsIds) {
    //         const proposal = await contract.methods.getOneProposal(proposalId).call({from: account});
    //         proposals.push(proposal.description);
    //     }
    //     console.log("Proposals - ProposalRegistering ", proposals);
    //     setProposals(proposals);
    //
    // }

    return (
        <div className="title-block">
            <h2>Thank you for voting, Tallying will begin shortly...</h2>
        </div>
    );
}

export default ClosedVotingSession;