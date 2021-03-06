import React from 'react';

import './deck.styles.scss';
import cardBackImage from '../../images/card-back.png';

const Deck = ({ cards, children }) => (
    <div className="deck">
        {cards.map((card, i) => (
            <img 
                className="card-back" 
                key={card} 
                src={cardBackImage} 
                alt={i}
                style={{
                    top: `-${i*2}px`
                }}
            ></img>
        ))}        
        {children}
    </div>
)

export default Deck;