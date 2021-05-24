import {Card, standardCardCompare, Suit, Trick} from 'ts-cards';
import {PlayerData} from '../CardGame';

export class CardGameTrick<T extends PlayerData> extends Trick {
  private playerDataByCard: Map<Card, T>;

  constructor(
    playerData: T,
    card: Card,
    cardCompare: (
      a: Card,
      b: Card,
      leadSuit?: Suit,
      trump?: Suit
    ) => number = standardCardCompare,
    trump?: Suit
  ) {
    super(card, cardCompare, trump);
    this.playerDataByCard = new Map<Card, T>();
    this.playerDataByCard.set(card, playerData);
  }

  public addCardToTrick(playerData: T, card: Card) {
    super.addCard(card);
    this.playerDataByCard.set(card, playerData);
  }

  public get winnningPlayerData() {
    return this.playerDataByCard.get(this.winningCard);
  }
}
