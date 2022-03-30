import React, { Component } from 'react';
import './App.scss';

import { 
  takeCardsFromDeck, 
  chooseTrump, 
  getFullTrumpName, 
  getDefendCards, 
  sortCards,
  checkExtraAttack, 
  isDefendCard,
  isOpponentLowestTrump } from './engine.js';

import { CardImages } from './data.js';
import cardBackImage from './images/card-back.png';

import Deck from './components/deck/deck.component';
import Hand from './components/hand/hand.component';
import Table from './components/table/table.component';
import DiscardPile from './components/discard-pile/discard-pile.component';
import Card from './components/card/card.component';
import CardBig from './components/card-big/card-big.component';


const Message = (props) => (
  <div className={`message${!props.display ? ` hidden` : ``}`}>
    {props.message}
  </div>
)

class App extends Component {
  constructor() {
    super();    

    this.state = {
      gameInit: null,
      gameOver: null,
      playerHand: [],
      opponentHand: [],
      table: [],
      trump: chooseTrump(),
      discardPile: [],      
      deck: [
        's6', 's7', 's8', 's9', 's10', 'sj', 'sq', 'sk', 'sa', 
        'c6', 'c7', 'c8', 'c9', 'c10', 'cj', 'cq', 'ck', 'ca', 
        'd6', 'd7', 'd8', 'd9', 'd10', 'dj', 'dq', 'dk', 'da', 
        'h6', 'h7', 'h8', 'h9', 'h10', 'hj', 'hq', 'hk', 'ha'
      ],
      playerDefend: null,
      message: {
        text: '',
        display: true
      }
    }
  }

  initState = {
    gameInit: true,
    gameOver: null,
    playerHand: [],
    opponentHand: [],
    table: [],
    trump: chooseTrump(),
    discardPile: [],      
    deck: [
      's6', 's7', 's8', 's9', 's10', 'sj', 'sq', 'sk', 'sa', 
      'c6', 'c7', 'c8', 'c9', 'c10', 'cj', 'cq', 'ck', 'ca', 
      'd6', 'd7', 'd8', 'd9', 'd10', 'dj', 'dq', 'dk', 'da', 
      'h6', 'h7', 'h8', 'h9', 'h10', 'hj', 'hq', 'hk', 'ha'
    ],
    playerDefend: null,
    message: {
      text: '',
      display: true
    }
  }


  initGame = () => {
    this.setState({gameInit: true}, 
      () => this.dealCards()
    );
  }

  playAgain = () => {
    this.setState(this.initState, 
      () => this.dealCards()
    );
  }


  dealCards = (next = false) => {
    if (!this.state.deck.length) {
      if (next === 'computer') this.computerAttackInit();
      return
    }

    let playerHand = [...this.state.playerHand];
    let opponentHand = [...this.state.opponentHand];
    let deckCopy = [...this.state.deck];

    let { hand: playerHandUpdated, deck: deckCopyUpdated } = takeCardsFromDeck(playerHand, deckCopy);
    let { hand: opponentHandUpdated, deck: deckCopyUpdatedTwice } = takeCardsFromDeck(opponentHand, deckCopyUpdated);

    // if dealing the first time, find player with the lowest trump
    let opponentLowestTrump = false;
    if (this.state.deck.length >= 36) {
      opponentLowestTrump = isOpponentLowestTrump(playerHandUpdated, opponentHandUpdated, this.state.trump);
    }

    this.setState(() => ({
      playerHand: playerHandUpdated,
      opponentHand: opponentHandUpdated,
      deck: deckCopyUpdatedTwice,
      playerDefend: (next === 'computer' || opponentLowestTrump) ? true : false
    }), () => { 
      if (next === 'computer' || opponentLowestTrump) {
        this.computerAttackInit();
      } 
    });
  }




  //=========================
  // PLAYER METHODS
  //=========================

  // onClick function for playerHand
  playCard = (cardPicked) => {
    let updatedHand = [...this.state.playerHand];
    updatedHand = updatedHand.filter(card => card !== cardPicked.props.card);

    this.setState(prevState => ({
      table: [...prevState.table, cardPicked.props.card],
      playerHand: updatedHand
    }), () => this.state.playerDefend ? this.computerAttackExtra() : this.computerDefend(cardPicked.props.card))  
  }

  playerCheckCards = (hand, table, computerCardPicked) => {
    // If we are defending, check cards that can beat the attacking card
    if (this.state.playerDefend) {
      this.playerDefend(computerCardPicked);
      return
    }

    // If we are attacking, check extra attack cards
    let result = hand.filter(card => {
      return checkExtraAttack(card, table)
    })
     
    // If there's no card to add to the table, computer defend is successful, give next turn to computer
    if (!result.length) {
      setTimeout(() => { 
        this.playerEndTurn() 
      }, 1000);      
    }    
  }

  // Player ends attack. Invoked by clicking a button or automatically if there are no cards to add
  playerEndTurn = () => {
    this.setState(prevState => ({
      discardPile: [...prevState.discardPile, ...prevState.table],
      table: [],
      playerDefend: true
    }), () => {
      this.setMessage('Defended!');
        setTimeout(() => {
          this.nextTurn('computer')
        }, 600);
    }); 
  }

  // Is invoked either by clicking on a button, or automatically, if there's no card to defend
  playerTakeCards = () => {
    this.setState(prevState => ({
      playerHand: [...prevState.playerHand, ...prevState.table],
      table: [],
      playerDefend: true
    }), () => this.nextTurn('computer')); 
  }

  playerDefend = (cardToBeat) => {
    let trump = this.state.trump;
    let hand = [...this.state.playerHand];

    let defendCards = getDefendCards(hand, cardToBeat, trump);

    // if no card to defend, take all cards, give turn to computer
    if (!defendCards[0]) {
      setTimeout(() => {
        if (this.state.playerHand.length === 0) {

          this.setMessage('Defended with the last card!', 1000);

          setTimeout(() => {
            this.computerEndTurn();
          }, 600);

          return
        }
        // comment this out if you want to take cards manually
        alert('Nothing to beat the card!');
        this.playerTakeCards();

      }, 500); 
    }
    return
  }

  

  //=========================
  // COMPUTER LOGIC
  //=========================

  // Initial computer attack (when it is computer's turn and the table is empty)
  computerAttackInit = () => {
    let sortedCards = sortCards(this.state.opponentHand, this.state.trump);
    this.computerPlayCard(sortedCards[0]);
  }

  // Add more cards with the same rank after initial attack
  computerAttackExtra = () => {    
    let cardsToAdd = this.state.opponentHand.filter(card => {
      return checkExtraAttack(card, this.state.table)
    })

    // If there's no extra attack, computer attack is over, next turn goes to player
    if (!cardsToAdd.length) {
      this.computerEndTurn();
      return
    }
    // else, add the first card from sorted list
    let sortedCards = sortCards(cardsToAdd, this.state.trump);
    this.computerPlayCard(sortedCards[0]);
  }

  computerEndTurn = () => {
    this.setState(prevState => ({
      discardPile: [...prevState.discardPile, ...prevState.table],
      table: [],
      playerDefend: false
    }), () => this.nextTurn('player'));
  }

  // Take chosen card from computer hand, and put it on the table
  computerPlayCard = (cardPicked) => {    
    let updatedHand = [...this.state.opponentHand];
    updatedHand = updatedHand.filter(card => card !== cardPicked);

    this.setState(prevState => ({
      table: [...prevState.table, cardPicked],
      opponentHand: updatedHand
    }), () => this.playerCheckCards(this.state.playerHand, this.state.table, cardPicked));
  }

  computerTakeCards = () => {
    this.setState(prevState => ({
      opponentHand: [...prevState.opponentHand, ...prevState.table],
      table: [],
      playerDefend: false
    }), () => this.nextTurn('player'));
  }

  // Beat the player's attack card
  computerDefend = (cardToBeat) => {
    let trump = this.state.trump;
    let hand = [...this.state.opponentHand];

    let defendCards = getDefendCards(hand, cardToBeat, trump);

    // if no card to defend, take all cards, give next turn to player
    if (!defendCards[0]) {
      this.computerTakeCards();
      return
    }

    // if there are defend cards, sort them, and play the first one  
    let chosenCard = sortCards(defendCards, trump)[0]
    this.computerPlayCard(chosenCard);
  }


  setMessage = (msg, timeout = 400) => {
    this.setState({
      message: {
        text: msg,
        display: true
      },
    });
    setTimeout(() => {
      this.setState({
        message: {
          text: msg,
          display: false
        }
      })
    }, timeout);
  }

  endGame = () => {
    if (this.state.playerHand.length === 0) {
      this.setMessage('Congratulations! You won', 5000);
      setTimeout(() => {
        this.setState({gameOver: true});
      }, 3000);
    } else {
      this.setMessage('You lost', 3000);
      setTimeout(() => {
        this.setState({gameOver: true});
      }, 3000);
    }
    return
  }

  
  nextTurn = (next) => {
    if (this.state.deck.length < 1 && (!this.state.playerHand.length || !this.state.opponentHand.length)) {
      this.endGame();
      return
    }

    if (next === 'computer') {
      // Message ==============
      this.setMessage('Computer turn');

      setTimeout(() => {
        this.dealCards('computer');
      }, 600);
    }

    if (next === 'player') {
      // Message ==============
      this.setMessage('Your turn');

      this.dealCards();
    }
  }


  render() {
    const { gameInit, gameOver, playerHand, table, deck, trump, discardPile, playerDefend } = this.state;

    if (!gameInit) {
      return (
        <div className="start-screen">
          <h3>Welcome to the Card Game!</h3>
          <button onClick={() => this.initGame()}>Play</button>
        </div>
      )
    }

    if (gameOver) {
      return (
        <div className="start-screen">
          <h3>Play Again?</h3>
          <button onClick={() => this.playAgain()}>Play</button>
        </div>
      )
    }

    return (
      <div className="App">
        <div className="hand opponent">
          {this.state.opponentHand.map(card => (
            <Card
              key={card}
              className="card"
              imageSource={cardBackImage}
              altText="card-back"
            />
          ))}
        </div>
        <div className="tableWrapper">
          <DiscardPile cards={discardPile} />
          <Table>
            {this.state.table.map(card => (
              <Card
                key={card}
                className="card"
                imageSource={CardImages[`${card}`]}
                altText="card-front"
              />
            ))}
            <Message 
              message={this.state.message.text} 
              display={this.state.message.display} 
            />
          </Table>
          <Deck cards={deck}>
            <h4 className="trump">{getFullTrumpName(this.state.trump)}</h4>
          </Deck>
        </div>
        <Hand className={`${playerHand.length >= 8 ? `large` : ``}`}>
          {playerHand.map(card => (
            <CardBig
              card={card}
              key={card}
              trump={trump}
              table={table}
              playCard={this.playCard}
              checkAttack={playerDefend ? false : !table.length ? true : checkExtraAttack(card, table)}
              playerDefend={playerDefend}
              isDefendCard={!playerDefend || !table.length ? null : isDefendCard(card, table, trump)}
            />
          ))}
        </Hand>
        {(table.length >= 2) && !playerDefend ? <button className="btn endturn" onClick={this.playerEndTurn}>End Turn</button> : null}
        {(table.length >= 1) && playerDefend ? <button className="btn takecards" onClick={this.playerTakeCards}>Take Card{table.length === 1 ? '' : 's'}</button> : null}
      </div>
    );
  }
}

export default App;