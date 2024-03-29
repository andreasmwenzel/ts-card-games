import {Suit, Card, two, clubs, hearts, Rank} from 'ts-cards';
import {PlayerParams} from '..';
import {Player} from '../Player';
import {Hearts} from './Hearts';
import {HeartsPlayerData} from './types';

export class HeartsPlayer extends Player {
  protected _game?: Hearts;

  public get handLength() {
    return this.hand?.length;
  }

  constructor({name, id}: PlayerParams, game: Hearts) {
    super({name, id}, game);
  }

  public setGame(game: Hearts | undefined) {
    this._game = game;
  }

  public playCard(card: Card) {
    this._game?.playCard(this, card);
  }

  public passCards(cards: Card[]) {
    this._game?.passCards(this, cards);
  }

  public hasCard(rank: Rank, suit: Suit): boolean {
    for (const card of this.hand) {
      if (card.rank === rank && card.suit === suit) {
        return true;
      }
    }
    return false;
  }

  public hasTwoOfClubs(): boolean {
    return this.hasCard(two, clubs);
  }

  public hasSuit(suit: Suit): boolean {
    for (const card of this.hand) {
      if (card.suit === suit) {
        return true;
      }
    }
    return false;
  }

  public hasOnlyHearts(): boolean {
    for (const card of this.hand) {
      if (card.suit !== hearts) {
        return false;
      }
    }
    return true;
  }

  public get playerData(): HeartsPlayerData {
    if (this._game) {
      return this._game.getPlayerData(this);
    }
    return {
      player: this,
      score: [],
      hand: [],
      name: this.name,
      position: -1,
      isReady: false,
      leftTable: false,
      round: {
        cardsDealt: [],
        cardsPassed: [],
        cardsPlayed: [],
        cardsReceived: [],
        cardsTaken: [],
        points: 0,
        hasPassed: false,
      },
    };
  }
}
