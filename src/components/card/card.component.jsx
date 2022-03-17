import React, { Component } from 'react';

import './card.styles.scss';
import cardBackImage from '../../images/card-back.png';


class Card extends Component {
    constructor(props) {
        super(props);
        const { suit, trump, table } = this.props;
        
        this.isTrump = (suit === trump) ? true : false;

        this.state = {
            isActive: this.checkActive(this, table[0])
        } 
    }

    checkActive = (card, cardToBeat) => {
        // if (!this.props.playerTurn) return false=
        if (cardToBeat === undefined) return true
    
        // if (card.isTrump && !cardToBeat.isTrump) return true
        // if (!card.isTrump && cardToBeat.isTrump) return false
        // if (!card.isTrump && !cardToBeat.isTrump) return this.checkSuit(card, cardToBeat);
        // if (card.isTrump && cardToBeat.isTrump) return this.checkRank(card, cardToBeat);
    }
    checkSuit = (card, cardToBeat) => {
        if (card.suit !== cardToBeat.suit) return false
        if (card.suit === cardToBeat.suit) return this.checkRank(card, cardToBeat);
    }
    checkRank = (card, cardToBeat) => {
        let ranks = [6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];
        let cardIndex = ranks.findIndex(rank => rank === card.rank);
        let cardToBeatIndex = ranks.findIndex(rank => rank === cardToBeat.rank);
        if (cardIndex < cardToBeatIndex) return false
        return true
    }

    render() {   
        const { card, isOpponent, move, images } = this.props;
        const { isActive } = this.state;
        const image = images[`${card}`];

        if (isOpponent) {
            return (
                <div className="card">
                    <img
                        src={cardBackImage}
                        alt="card-back"
                    ></img>
                </div>
            );
        }
        return (
            <div 
                className={`card${isActive?` active`:` disabled`}`} 
                onClick={() => move !== null ? move(this) : null}
            >
                <img
                    src={image}
                    alt="card-front"
                ></img>
            </div>
        );
    }
}

export default Card;