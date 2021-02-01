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
  public readonly suit: Suit;
  public readonly rank: Rank;
  public readonly deck?: Deck | null;
  public readonly description:string
  constructor(suit: Suit, rank: Rank, deck?:Deck) {
    this.suit = suit;
    this.rank = rank;
    this.description =`${this.rank} of ${this.suit}`;
    this.deck=deck;
  }
}

export function compareCards(a:Card,b:Card, rankValue:RankValues, suitValue:any):number {
  if(a.suit == b.suit){
    return rankValue[a.rank] - rankValue[b.rank];
  }else{
    if(suitValue[a.suit] == suitValue[b.suit]){
      return rankValue[a.rank] - rankValue[b.rank]
    }else{
      return suitValue[a.suit] - suitValue[b.suit];
    }
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




export interface SuitValues{
  clubs:number, 
  diamonds:number,
  spades:number,
  hearts:number
}