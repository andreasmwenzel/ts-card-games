import { Deck } from "../deck";
import { Card, Rank, Suit, RankValues } from "../card";

/**
 * @class PinochelDeck
 * @extends Deck
 */
export class PinochleDeck extends Deck {
  constructor() {
    super(generateDeck());
  }
}

const suits: Suit[] = ["spades", "hearts", "diamonds", "clubs"];
const ranks: Rank[] = ["9", "J", "Q", "K", "10", "A"];

const generateDeck = () => {
  const cards: Card[] = [];

  for (let suit of suits) {
    for (let rank of ranks) {
      cards.push(new Card(suit, rank, this));
      cards.push(new Card(suit, rank, this));
    }
  }

  return cards;
};

export let pinochleRankValues:RankValues = {
  "2":0,
  "3":0,
  "4":0,
  "5":0,
  "6":0,
  "7":0,
  "8":0,
  "9":9,
  "J":10,
  "Q":11,
  "K":12,
  "10":13,
  "A":14,
}
