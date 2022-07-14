import React, {useRef} from 'react';

function AddVoters({handleClick}) {
    const inputEthAddress = useRef(null);

    const onClick = () => {
        handleClick(inputEthAddress.current.value);
    }

    return (
        <div>
            <h3>Add a voter:</h3>
            <div className="input-group mb-3">
                <input type="text" className="form-control input-address"
                       ref={inputEthAddress}
                       placeholder="Voter's ETH Address"
                       id="ethAddress"
                       aria-label="Voter's ETH Address"
                       aria-describedby="basic-addon2"
                />
                <div className="input-group-append">
                    <button className="btn btn-primary input-add-button" onClick={onClick}
                            type="button">Add
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddVoters;