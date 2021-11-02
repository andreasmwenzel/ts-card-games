import {CardGame} from './CardGame';
import {Card} from 'ts-cards';
import {v4 as uuidv4} from 'uuid';
import {PlayerParams} from '.';

export abstract class Player {
  public name: string;
  public readonly id: string;

  protected abstract _game?: CardGame;

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

  set ready(ready: boolean) {
    this._game?.playerReady(this, ready);
  }

  get game(): string | undefined {
    return this._game?.id;
  }
  constructor({name, id}: PlayerParams) {
    this.name = name;
    this.id = id ? id : uuidv4();
  }

  public leaveGame() {
    this._game?.removePlayer(this);
  }

  public joinGame(game: CardGame, position = -1) {
    game.addPlayer(this, position);
    this._game = game;
  }

  public movePosition(position: number, tradePositions = false) {
    if (this._game === undefined) {
      throw new Error(
        `Move Position Error: Player ${this.name} is not assigned to a game`
      );
    }
    this._game?.movePosition(this, position, tradePositions);
  }
}
