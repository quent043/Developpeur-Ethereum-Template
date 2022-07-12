import React, {Fragment} from 'react';
import './Dashboard.css'

function VotersTable({voters}) {
    return (
        <Fragment>
            <table className="table voter-table">
                <thead>
                <tr>
                    <th scope="col">Registered Voters</th>
                </tr>
                </thead>
                <tbody>
                {voters.map((voter, index) => (
                        <tr key={index}>
                            <td>{voter}</td>
                        </tr>
                    )
                )}
                </tbody>
            </table>
        </Fragment>
    );
}

export default VotersTable;