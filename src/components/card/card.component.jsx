import React from 'react';

import './card.styles.scss';


const Card = ({ className, imageSource, altText }) => (
    <div className={className}>
        <img
            src={imageSource}
            alt={altText}
        />
    </div>
)

export default Card;
