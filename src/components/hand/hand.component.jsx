import React from 'react';

import './hand.styles.scss';


const Hand = (props) => (
    <div className={`hand ${props.className}`}>
        {props.children}
    </div>
)

export default Hand;