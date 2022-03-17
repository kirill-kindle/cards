import React from 'react';

import Card from '../card/card.component';

import './table.styles.scss';


const Table = ({ passedCards, images, children }) => (
    <div className="table">
        {children}
        {passedCards.map(card => {
            const suit = card.substring(0, 1);
            const rank = card.substring(1, 3);
            return <Card 
                card={card} 
                images={images} 
                suit={suit} 
                rank={rank} 
                key={card}
                table={passedCards}
                move={null}
            />
        })}
    </div>
)

export default Table;