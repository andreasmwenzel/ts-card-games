import {PlayerParams} from '..';
import {Player} from '../Player';
import {Pinochle} from './Pinochle';

export class PinochlePlayer extends Player {
  protected _game?: Pinochle;

  public get handLength() {
    return this.hand?.length;
  }

  constructor({name, id}: PlayerParams, game: Pinochle) {
    super({name, id}, game);
  }

  public setGame(game: Pinochle | undefined) {
    this._game = game;
  }
}
