import React from 'react';

import './discard-pile.styles.scss';
import cardBackImage from '../../images/card-back.png';

const DiscardPile = ({ cards }) => (
    <div className="discard-pile">
        {cards.map((card, i) => (
            <img 
                className="card-back-discarded" 
                key={card} 
                src={cardBackImage} 
                alt={i}
                style={{
                    top: `${Math.floor(Math.random()) ? '-': ''}${i*2}px`,
                    transform: `rotate(${Math.floor(Math.random()) ? '-': ''}${Math.floor(Math.random() * 10)}deg)`
                }}
            ></img>
        ))}
    </div>
)

export default DiscardPile;