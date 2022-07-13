import React, {Fragment, useEffect, useState} from 'react';
import {ProposalRegistering} from "./ProposalRegistering";
import useEth from "../../contexts/EthContext/useEth";
import VotingModule from "./VotingModule";
import ProposalGetter from "./ProposalGetter";
import ClosedProposalMenu from "./ClosedProposalMenu";
import ClosedVotingSession from "./ClosedVotingSession";

function UserDashboard({account, contract, workflowStatus, voter}) {
    const [proposals, setProposals] = useState([]);

    useEffect(() => {
        return () => {
            getProposalEvents();
        };
    }, []);


    const handleRegisterProposal = (proposal) => {
        _registerProposal(proposal);
    }

    const _registerProposal = async (description) => {
        try {
            await contract.methods.addProposal(description).send({from: account});
            getProposalEvents();
        } catch (err) {
            console.log(err);
            console.error("Contract Error: ", err.code);
            // setErrorMessage(err.code);
        }
    }

    const getProposalEvents = async () => {
        let options = {
            fromBlock: 0,
            toBlock: "latest"
        }

        const contractEvents = await contract.getPastEvents("ProposalRegistered",  options);
        console.log("Contract Events - ProposalRegistering: ", contractEvents);
        let proposalsIds = [];
        contractEvents.forEach(element => {

            proposalsIds.push(element.returnValues._proposalId);
        });

        let proposals = [];
        for (const proposalId of proposalsIds) {
        //TODO: Add try catch
            const proposal = await contract.methods.getOneProposal(proposalId).call({from: account});
            proposals.push(proposal.description);
        }
        setProposals(proposals);

    }
    return (
        // <div className="flex-container">
        <div>
            {workflowStatus === "1" && <ProposalRegistering contract={contract} account ={account} workflowStatus ={workflowStatus}
                                                            proposals={proposals} handleRegisterProposal={handleRegisterProposal}/>}
            {workflowStatus === "2" && <ClosedProposalMenu contract={contract} account={account} workflowStatus={workflowStatus} proposals={proposals}/>}
            {workflowStatus === "3" && <VotingModule account={account} workflowStatus={workflowStatus} contract={contract} proposals={proposals} voter={voter}/>}
            {workflowStatus === "4" && <ClosedVotingSession />}
            {/*{workflowStatus !== "0" && <ProposalGetter account ={account} workFlowStatus ={workflowStatus} contract={contract}/>}*/}
        </div>
    );
}

export default UserDashboard;