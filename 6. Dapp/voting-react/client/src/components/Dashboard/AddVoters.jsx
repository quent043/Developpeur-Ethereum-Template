import React, {Fragment, useState, useEffect, useRef} from 'react';

function AddVoters(props) {


    return (
        <div>
            <h3>Add a voter:</h3>
            <div className="input-group mb-3">
                <input type="text" className="form-control"
                       ref={inputEthAddress}
                       placeholder="Voter's ETH Address"
                       id="ethAddress"
                       aria-label="Voter's ETH Address"
                       aria-describedby="basic-addon2"
                />
                <div className="input-group-append">
                    <button className="btn btn-outline-secondary" onClick={handleClick}
                            type="button">Add
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddVoters;