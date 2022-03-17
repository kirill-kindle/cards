import React, { Component } from 'react';
import './App.css';

import Deck from './components/deck/deck.component';
import Hand from './components/hand/hand.component';
import Table from './components/table/table.component';


class App extends Component {
  constructor() {
    super();    

    this.state = {
      playerHand: [],
      opponentHand: [],
      table: [],
      trump: '',
      discardPile: [],      
      deck: [
        's6', 's7', 's8', 's9', 's10', 'sj', 'sq', 'sk', 'sa', 
        'c6', 'c7', 'c8', 'c9', 'c10', 'cj', 'cq', 'ck', 'ca', 
        'd6', 'd7', 'd8', 'd9', 'd10', 'dj', 'dq', 'dk', 'da', 
        'h6', 'h7', 'h8', 'h9', 'h10', 'hj', 'hq', 'hk', 'ha'
      ],
      playerTurn: ''
    }

    this.cardImages = {
      s6: require('./images/cards/s-6.png'),
      s7: require('./images/cards/s-7.png'),
      s8: require('./images/cards/s-8.png'),
      s9: require('./images/cards/s-9.png'),
      s10: require('./images/cards/s-10.png'),
      sj: require('./images/cards/s-j.png'),
      sq: require('./images/cards/s-q.png'),
      sk: require('./images/cards/s-k.png'),
      sa: require('./images/cards/s-a.png'),
      c6: require('./images/cards/c-6.png'),
      c7: require('./images/cards/c-7.png'),
      c8: require('./images/cards/c-8.png'),
      c9: require('./images/cards/c-9.png'),
      c10: require('./images/cards/c-10.png'),
      cj: require('./images/cards/c-j.png'),
      cq: require('./images/cards/c-q.png'),
      ck: require('./images/cards/c-k.png'),
      ca: require('./images/cards/c-a.png'),
      h6: require('./images/cards/h-6.png'),
      h7: require('./images/cards/h-7.png'),
      h8: require('./images/cards/h-8.png'),
      h9: require('./images/cards/h-9.png'),
      h10: require('./images/cards/h-10.png'),
      hj: require('./images/cards/h-j.png'),
      hq: require('./images/cards/h-q.png'),
      hk: require('./images/cards/h-k.png'),
      ha: require('./images/cards/h-a.png'),
      d6: require('./images/cards/d-6.png'),
      d7: require('./images/cards/d-7.png'),
      d8: require('./images/cards/d-8.png'),
      d9: require('./images/cards/d-9.png'),
      d10: require('./images/cards/d-10.png'),
      dj: require('./images/cards/d-j.png'),
      dq: require('./images/cards/d-q.png'),
      dk: require('./images/cards/d-k.png'),
      da: require('./images/cards/d-a.png')
    }
  }

  componentDidMount() {
    this.setState({
      playerTurn: true,
      trump: this.chooseTrump()
    });

    this.dealCards();    
  }

  // Choose a trump
  chooseTrump = () => {
    // spades, clubs, diamonds, hearts
    let suits = ['s', 'c', 'd', 'h'];
    let trump = suits[Math.floor(Math.random() * suits.length)];
    return trump;
}

  dealCards = () => {
    let playerHand = [];
    let opponentHand = [];
    let deckCopy = [...this.state.deck];

    let { hand: playerHandUpdated, deck:deckCopyUpdated } = this.selectRandomCards(playerHand, deckCopy);
    let { hand: opponentHandUpdated, deck:deckCopyUpdatedTwice } = this.selectRandomCards(opponentHand, deckCopyUpdated);

    this.setState(() => ({
      playerHand: playerHandUpdated,
      opponentHand: opponentHandUpdated,
      deck: deckCopyUpdatedTwice
    }));
  }

  selectRandomCards = (hand, deck) => {
    if (hand.length >= 6) {
        return { hand, deck };
    }
    
    let randomNum = Math.floor(Math.random() * deck.length);
    let newCard = deck.splice(randomNum, 1);
    hand.push(newCard[0]);

    return this.selectRandomCards(hand, deck);
  }

  move = (cardPicked) => {
    const { playerTurn, playerHand, table } = this.state;

    if (!playerTurn) return;
    if (!cardPicked.state.isActive) return;

    let updatedHand = [...playerHand];

    updatedHand = updatedHand.filter(card => card !== cardPicked.props.card);

    this.setState({
      table: [...table, cardPicked.props.card],
      playerHand: updatedHand
    });
  }


  render() {
    const { opponentHand, playerHand, table, deck, trump, playerTurn } = this.state;
    const { cardImages } = this;

    return (
      <div className="App">
        <Hand 
          hand={opponentHand} 
          images={cardImages} 
          trump={trump}
          table={table}
          isOpponent={true}  
          playerTurn={playerTurn}         
        />
        <div className="tableWrapper">
          <div className="discard"></div>
          <Table passedCards={table} images={cardImages} trump={trump} />
          <Deck cards={deck} trump={trump} />
        </div>      
        <Hand 
          hand={playerHand} 
          images={cardImages} 
          trump={trump}
          table={table}
          isOpponent={false}
          playerTurn={playerTurn}           
          move={this.move} 
        />
      </div>
    );
  }
}

export default App;