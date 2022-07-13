import React, {Fragment} from 'react';
import './Dashboard.css'

function Table({items, title, style}) {
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
                {items.map((item, index) => (
                        <tr key={index}>
                            <td>{item}</td>
                        </tr>
                    )
                )}
                </tbody>
            </table>
        </Fragment>
    );
}

export default Table;