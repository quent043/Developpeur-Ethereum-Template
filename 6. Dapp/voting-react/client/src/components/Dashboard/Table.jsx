import React, {Fragment} from 'react';
import './Dashboard.css'

function Table({items, title}) {
    return (
        <Fragment>
            <table className="table voter-table">
                <thead>
                <tr>
                    <th scope="col">{title}</th>
                </tr>
                </thead>
                <tbody>
                {items.map((voter, index) => (
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

export default Table;