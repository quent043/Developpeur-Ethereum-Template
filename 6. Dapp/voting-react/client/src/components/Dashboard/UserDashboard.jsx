import React, {useEffect, useState} from 'react';
import {ProposalRegistering} from "./ProposalRegistering";
import VotingModule from "./VotingModule";
import ClosedProposalMenu from "./ClosedProposalMenu";
import ClosedVotingSession from "./ClosedVotingSession";
import {toast} from "react-toastify";

function UserDashboard({account, contract, workflowStatus, voter, updateVoter}) {
    const [proposals, setProposals] = useState([]);

    useEffect(() => {
        return () => {
            getProposalEvents();
        };
    }, []);

    const handleRegisterProposal = async (description) => {
        try {
            await contract.methods.addProposal(description).send({from: account});
            toast.success("Proposal successfully registered !");
            await getProposalEvents();
        } catch (err) {
            toast.error("Error connecting to the blockchain");
        }
    }

    const getProposalEvents = async () => {
        let options = {
            fromBlock: 0,
            toBlock: "latest"
        }

        try {
            const contractEvents = await contract.getPastEvents("ProposalRegistered", options);

            let proposalsIds = [];
            contractEvents.forEach(element => {
                proposalsIds.push(element.returnValues._proposalId);
            });

            let proposals = [];
            for (const proposalId of proposalsIds) {
                const proposal = await contract.methods.getOneProposal(proposalId).call({from: account});
                proposals.push(proposal.description);
            }
            setProposals(proposals);
        } catch (err) {
            toast.error("Error connecting to the blockchain");
        }
    }

    return (
        <div>
            {workflowStatus === "1" &&
                <ProposalRegistering contract={contract} account={account}
                                     workflowStatus={workflowStatus}
                                     proposals={proposals}
                                     handleRegisterProposal={handleRegisterProposal}/>}
            {workflowStatus === "2" &&
                <ClosedProposalMenu contract={contract} account={account}
                                    workflowStatus={workflowStatus}
                                    proposals={proposals}/>}
            {workflowStatus === "3" &&
                <VotingModule account={account} workflowStatus={workflowStatus}
                              contract={contract} proposals={proposals}
                              voter={voter} updateVoter={updateVoter}/>}
            {workflowStatus === "4" && <ClosedVotingSession/>}
        </div>
    );
}

export default UserDashboard;