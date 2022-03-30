import React, { Component } from 'react';

import './card-big.styles.scss';
import { CardImages } from '../../data.js';
import { getSuit } from '../../engine';

// import Sound1 from '../../sounds/card-1.mp3';

class CardBig extends Component {
    constructor(props) {
        super(props);

        this.state = {}
    }

    render() {   
        const { card, playCard, checkAttack, playerDefend, isDefendCard, trump  } = this.props;
        const image = CardImages[`${card}`];

        // Playing with audio =========
        // also check https://developer.chrome.com/blog/autoplay/#web-audio
        // let sound = new Audio(Sound1);

        if (playerDefend) {
            return (
                <div 
                    className={`card${isDefendCard ? ` active` : ` disabled`}`} 
                    onClick={() => !isDefendCard ? null : playCard(this)}
                    style={getSuit(card) === trump ? {border: "2px solid blue"} : null}
                >
                    <img
                        src={image}
                        alt="card-front"
                    ></img>
                </div>
            );
        }
        return (
            <div 
                className={`card${checkAttack ? ` active` : ` disabled`}`} 
                onClick={() => !checkAttack ? null : playCard(this)}
                style={getSuit(card) === trump ? {border: "2px solid blue"} : null}
                // onMouseEnter={() => sound.play()}
            >
                <img
                    src={image}
                    alt="card-front"
                ></img>
            </div>
        );
    }
}

export default CardBig;