import {Suit, Card, two, clubs, hearts} from 'ts-cards';
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
    if (this.hasCard(card)) {
      this._game?.playCard(this, card);
    }
  }

  public passCard(cards: Card[]) {
    this._game?.passCards(this, cards);
  }

  public hasCard(card: Card): boolean {
    if (this.hand?.includes(card)) {
      return true;
    } else {
      throw new Error('Card Error: Player does not have that card');
    }
  }
  public hasTwoOfClubs(): boolean {
    if (this.hand) {
      for (const card of this.hand) {
        if (card.rank === two && card.suit === clubs) {
          return true;
        }
      }
      return false;
    }
    return false;
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
