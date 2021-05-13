import {Suit, Card, two, clubs, hearts, Rank} from 'ts-cards';
import {Player} from '../Player';
import {Hearts} from './Hearts';

export class HeartsPlayer extends Player {
  protected _game?: Hearts;

  public get handLength() {
    return this.hand?.length;
  }

  constructor(name: string, id: string) {
    super(name, id);
  }

  public playCard(card: Card) {
    this._game?.playCard(this, card);
  }

  public passCards(cards: Card[]) {
    this._game?.passCards(this, cards);
  }

  public hasCard(rank: Rank, suit: Suit): boolean {
    if (this.hand) {
      for (const card of this.hand) {
        if (card.rank === rank && card.suit === suit) {
          return true;
        }
      }
      return false;
    }
    return false;
  }

  public hasTwoOfClubs(): boolean {
    return this.hasCard(two, clubs);
  }

  public hasSuit(suit: Suit): boolean {
    if (this.hand) {
      for (const card of this.hand) {
        if (card.suit === suit) {
          return true;
        }
      }
      return false;
    }
    return false;
  }

  public hasOnlyHearts(): boolean {
    if (this.hand) {
      for (const card of this.hand) {
        if (card.suit !== hearts) {
          return false;
        }
      }
      return true;
    }
    return true;
  }
}
