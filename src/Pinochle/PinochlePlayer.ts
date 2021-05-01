import {Card} from 'ts-cards';
import {Player} from '../Player';
import {Pinochle} from './Pinochle';

export class PinochlePlayer extends Player {
  _game?: Pinochle;

  constructor(name: string, id: string) {
    super(name, id);
  }
}
