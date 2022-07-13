import React, {Fragment} from 'react';
import './Dashboard.css'

function MultiTable({items, title, style}) {
    const css = "table " + style;

    return (
        <Fragment>
            <table className={css}>
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

export default MultiTable;