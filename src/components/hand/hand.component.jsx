import React from 'react';

import Card from '../card/card.component';

import './hand.styles.scss';


const Hand = ({ hand, images, trump, table, isOpponent, playerTurn, move }) => (
    <div className={`hand ${isOpponent?`opponent`:``}`}>
        {hand.map(card => {
            const suit = card.substring(0, 1);
            const rank = card.substring(1, 3);
            return <Card 
                card={card} 
                images={images} 
                suit={suit} 
                rank={rank} 
                key={card} 
                trump={trump}
                table={table}
                isOpponent={isOpponent}
                playerTurn={playerTurn}
                move={isOpponent?null:move}
            />
        })}
    </div>
)

export default Hand;