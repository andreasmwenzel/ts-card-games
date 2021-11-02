// import {Card} from 'ts-cards';
import {PlayerParams} from '..';
import {Player} from '../Player';
import {Pinochle} from './Pinochle';

export class PinochlePlayer extends Player {
  _game?: Pinochle;

  constructor({name, id}: PlayerParams) {
    super({name, id});
  }
}
