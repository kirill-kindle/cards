import React from 'react';

import './table.styles.scss';


const Table = (props) => (
    <div className="table">
        {props.children}
    </div>
)

export default Table;