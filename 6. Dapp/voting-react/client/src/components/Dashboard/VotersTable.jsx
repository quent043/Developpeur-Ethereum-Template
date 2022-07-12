import React, {Fragment} from 'react';
import './Dashboard.css'

function VotersTable({voters}) {
    return (
        <Fragment>
            <table className="table">
                <thead>
                <tr>
                    <th scope="col">Registered Voters</th>
                </tr>
                </thead>
                <tbody>
                {voters.map((voter, index) => (
                        <tr>
                            <td key={index}>{voter}</td>
                        </tr>
                    )
                )}
                </tbody>
            </table>
        </Fragment>
    );
}

export default VotersTable;