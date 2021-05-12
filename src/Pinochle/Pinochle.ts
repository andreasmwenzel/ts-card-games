import {CardGame, CardGameInfo, PlayerData} from '../CardGame';
// import {Card, pinochleCardCompare} from 'ts-cards';
import {Player} from '../Player';
import {PinochlePlayer} from './PinochlePlayer';

export class Pinochle extends CardGame {
  protected _game?: Pinochle;

  protected playerData: PlayerData[] = [];

  constructor(id: string) {
    super(id);
  }
  public get gameInfo(): CardGameInfo {
    return this.gameInfo;
  }

  public addPlayer(player: Player, position: number): number {
    if (player instanceof PinochlePlayer) {
      return super.addPlayer(player, position);
    } else {
      throw new Error(
        'Join Game Error: Only Pinochle Players can join Pinochle games'
      );
    }
  }

  protected playerCount = 4;

  protected startGame(): void {}
}
