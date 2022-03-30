import React from 'react';

import Card from '../card/card.component.jsx';
import { CardImages } from '../../data.js';

const CardPlayer = ({card, playCard}) => {
    const imageSource = CardImages[`${card}`];

    return(
        <div 
            className="card-player" 
            onClick={() => playCard(this)}
        >
            <Card 
                className="card"
                imageSource={imageSource} 
                altText="card-front"
            />
        </div>
    )
}

export default CardPlayer;