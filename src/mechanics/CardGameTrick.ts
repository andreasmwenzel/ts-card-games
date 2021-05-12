import {Card, Suit, Trick} from 'ts-cards';
import {PlayerData} from '../CardGame';

export class CardGameTrick<T extends PlayerData> extends Trick {
  private playerDataByCard: Map<Card, T>;

  constructor(
    playerData: T,
    card: Card,
    cardCompare: (a: Card, b: Card, leadSuit?: Suit, trump?: Suit) => number,
    trump?: Suit
  ) {
    super(card, cardCompare, trump);
    this.playerDataByCard = new Map<Card, T>();
    this.playerDataByCard.set(card, playerData);
  }

  public get winnningPlayerData() {
    return this.playerDataByCard.get(this.winner);
  }
}
