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

export function compareCards(a:Card,b:Card, rankValue:RankValues, suitValue:any, trump:Suit|null):number {
  if(a.suit == b.suit){
    return rankValue[a.rank] - rankValue[b.rank];
  }else{
     if(a.suit == trump){ return 1}
     if(b.suit == trump){ return -1}
     return suitValue[a.suit] - suitValue[b.suit];
  }
}

export interface RankValues{
  "2":number,
  "3":number,
  "4":number,
  "5":number,
  "6":number,
  "7":number,
  "8":number,
  "9":number,
  "10":number,
  "J":number,
  "Q":number,
  "K":number,
  "A":number,
}

export let defaultRankValue:RankValues = {
  "2":2,
  "3":3,
  "4":4,
  "5":5,
  "6":6,
  "7":7,
  "8":8,
  "9":9,
  "10":3,
  "J":11,
  "Q":12,
  "K":13,
  "A":14,
}

export interface SuitValues{
  clubs:number, 
  diamonds:number,
  spades:number,
  hearts:number
}