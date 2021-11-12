import {PlayerParams} from '..';
import {CardGame} from '../CardGame';
// import {Card, pinochleCardCompare} from 'ts-cards';
import {CardGameInfo, PlayerData} from '../types';
import {PinochlePlayer} from './PinochlePlayer';
import {PinochleParams} from './types';

export class Pinochle extends CardGame {
  protected _game?: Pinochle;

  protected playerData: PlayerData[] = [];

  constructor({id, name, data}: PinochleParams) {
    super({id, name, data});
  }
  public get gameInfo(): CardGameInfo {
    return this.gameInfo;
  }

  public addPlayer({name, id}: PlayerParams, pos = -1): PinochlePlayer {
    const p = new PinochlePlayer({name, id}, this);
    this.addPlayerToGame(p, pos);
    return p;
  }

  protected playerCount = 4;

  protected startGame(): void {}
}
