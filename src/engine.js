import { CardRanks } from './data.js';

//============
// Add 6 random cards from deck to hand. 
// Returns updated hand with 6 cards in it, and an updated deck with -6 cards
//============

const takeCardsFromDeck = (hand, deck, counter = 6) => {
    if (hand.length >= counter || deck.length < 1) {
        return { hand, deck };
    }
    
    let randomNum = Math.floor(Math.random() * deck.length);
    let newCard = deck.splice(randomNum, 1);
    hand.push(newCard[0]);

    return takeCardsFromDeck(hand, deck, counter);
}

const chooseTrump = () => {
    // spades, clubs, diamonds, hearts
    let suits = ['s', 'c', 'd', 'h'];
    let trump = suits[Math.floor(Math.random() * suits.length)];
    return trump;
}

const getFullTrumpName = (trump) => {
    if (trump === 's') return 'Spades'
    if (trump === 'c') return 'Clubs'
    if (trump === 'd') return 'Diamonds'
    if (trump === 'h') return 'Hearts'
    return
}

const getTrumpCards = (hand, trump) => {
    return hand.filter(card => getSuit(card) === trump)
}

const getNonTrumpCards = (hand, trump) => {
    return hand.filter(card => getSuit(card) !== trump)
}

const getSuit = (card) => {
    let suit = card.substring(0, 1);
    return suit;
}

const getRank = (card) => {
    let rank = card.substring(1, 3);
    return rank;
}

const getRankIndex = (card) => {
    let targetRank = getRank(card);
    let rankIndex = '';
    CardRanks.forEach((rank, index) => {
        if (rank === targetRank) rankIndex = index
    })
    return rankIndex;
}

const checkRank = (cardRank, targetRank) => {
    let cardRankIndex = CardRanks.findIndex(rank => rank === cardRank);
    let targetCardRankIndex = CardRanks.findIndex(rank => rank === targetRank);    
    
    if (cardRankIndex < targetCardRankIndex) return false
    return true
}

const sortByRank = (hand) => {
    let sortedHand = [];
    for (let i = 0; i < CardRanks.length; i++) {
        hand.forEach(card => {
            let cardIndex = getRankIndex(card);
            if (cardIndex === i) sortedHand.push(card)
        })
    }
    return sortedHand;
}

// Sort cards by rank, but put trump cards at the end
const sortCards = (hand, trump) => {
    let cards = sortByRank(getNonTrumpCards(hand, trump));
    let trumps = sortByRank(getTrumpCards(hand, trump));
    let cardsAll = [...cards, ...trumps];
    return cardsAll;
}

const getLowestTrumpRank = (trumps1, trumps2) => {
    let allTrumps = [...trumps1, ...trumps2];
    let sortedTrumps = sortByRank(allTrumps);

    return sortedTrumps[0];
}

const isOpponentLowestTrump = (playerHand, opponentHand, trump) => {
    let playerTrumps = getTrumpCards(playerHand, trump);
    let opponentTrumps = getTrumpCards(opponentHand, trump);

    let lowestTrump = getLowestTrumpRank(playerTrumps, opponentTrumps);

    let result = false;
    if (opponentTrumps.includes(lowestTrump)) result = true;

    return result;
}

const getDefendCards = (hand, targetCard, trump) => {
    let targetSuit = getSuit(targetCard);
    let targetRank = getRank(targetCard);
    let targetIsTrump = targetSuit === trump ? true : false;

    let defendCardsList = hand.filter(card => {
      let cardSuit = getSuit(card);
      let cardRank = getRank(card);
      let cardIsTrump = cardSuit === trump ? true : false;      
      
      if (cardIsTrump && !targetIsTrump) return true
      if (!cardIsTrump && targetIsTrump) return false      
      if (cardIsTrump && targetIsTrump) return checkRank(cardRank, targetRank);
      
      if (cardSuit !== targetSuit) return false
      return checkRank(cardRank, targetRank);
    });
    
    return defendCardsList;
}

const isDefendCard = (defendCard, table, trump) => {
    // Target card (card to beat) props
    let targetCard = table[table.length - 1];
    let targetSuit = getSuit(targetCard);
    let targetRank = getRank(targetCard);
    let targetIsTrump = targetSuit === trump ? true : false;

    // Defend card props
    let cardSuit = getSuit(defendCard);
    let cardRank = getRank(defendCard);
    let cardIsTrump = cardSuit === trump ? true : false;   

    if (cardIsTrump && !targetIsTrump) return true
    if (!cardIsTrump && targetIsTrump) return false      
    if (cardIsTrump && targetIsTrump) return checkRank(cardRank, targetRank);
    if (cardSuit !== targetSuit) return false
    return checkRank(cardRank, targetRank);
}

// Check if the card rank matches any card from the table
const checkExtraAttack = (card, table) => {
    if (table === undefined || !table.length) return

    let cardRank = getRank(card);
    
    let filteredTable = table.filter(card => {
        let targetRank = getRank(card);
        return cardRank === targetRank
    });

    if (filteredTable.length !== 0) return true
    return false
}


export { 
    takeCardsFromDeck, 
    chooseTrump,
    getFullTrumpName,
    getSuit, 
    getRank, 
    checkRank, 
    sortCards,
    getLowestTrumpRank,
    isOpponentLowestTrump,
    getDefendCards, 
    isDefendCard,
    checkExtraAttack
};