import { Deck } from "../deck";
import { Card, Rank, Suit } from "../card";

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
      cards.push(new Card(suit, rank));
      cards.push(new Card(suit, rank));
    }
  }

  return cards;
};
