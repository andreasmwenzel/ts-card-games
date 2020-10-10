import { Deck } from "./deck";

export type Suit = "hearts" | "spades" | "diamonds" | "clubs";
export type Rank =
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K"
  | "A";

export class Card {
  public suit: Suit;
  public rank: Rank;
  public deck?: Deck | null;
  constructor(suit: Suit, rank: Rank) {
    this.suit = suit;
    this.rank = rank;
  }
}
