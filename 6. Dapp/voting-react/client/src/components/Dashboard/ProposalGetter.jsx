import React, {Fragment, useEffect, useRef, useState} from 'react';
import useEth from "../../contexts/EthContext/useEth";

function ProposalGetter({account, workFlowStatus, contract}) {
    const [proposalDescription, setProposalDescription] = useState("");
    const proposalId = useRef(null);

    const getProposal = async () => {
        try {
            let proposal = await contract.methods.getOneProposal(proposalId.current.value).call({from: account});
            setProposalDescription(proposal.description);
        } catch (err) {
            setProposalDescription(null);
            console.log("Quentin - ", err.message);
        }
    }

    getEvents();
    const getEvents = async ()=> {
        const contractEvents = await contract.getPastEvents("dataStored");
        console.log("Events ", contractEvents);
    }

    return (
        <Fragment>
            <div>
                <input type="number" ref={proposalId}
                       placeholder="Proposal Id"/>
                <button onClick={getProposal}>Get Proposal</button>
            </div>
            <div>
                {(proposalDescription && proposalId) &&
                    <div>
                        Proposal with id {proposalId.current.value} is: {proposalDescription}
                    </div>}
            </div>
        </Fragment>
    );
}

export default ProposalGetter;
