import {CardGame} from './CardGame';
import {Card} from 'ts-cards';
import {v4 as uuidv4} from 'uuid';
import {PlayerParams} from '.';

export abstract class Player {
  public name: string;
  public readonly id: string;
  protected abstract _game?: CardGame;

  constructor({name, id}: PlayerParams, game: CardGame) {
    this.setGame(game);
    this.name = name;
    this.id = id ? id : uuidv4();
  }

  abstract setGame(game: CardGame | undefined): void;
  get position() {
    return this._game?.playerPosition(this);
  }
  get hand(): ReadonlyArray<Card> {
    const hand = this._game?.playerHand(this);
    return hand ? hand : [];
  }
  get ready(): boolean {
    const isReady = this._game?.isPlayerReady(this);
    return isReady ? isReady : false;
  }

  setReady(ready = true) {
    this._game?.playerReady(this, ready);
  }
  get gameId(): string | undefined {
    return this._game?.id;
  }

  public leaveGame() {
    this._game?.removePlayer(this);
  }
}
