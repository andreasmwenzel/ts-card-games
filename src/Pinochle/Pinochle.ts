import {CardGame} from "../CardGame";
import { Card, pinochleRankValues } from "../cards";
import { Player } from "../Player";
import { PinochlePlayer } from "./PinochlePlayer";

export class Pinochle extends CardGame {
  public players: PinochlePlayer[] = [];
  protected _game?:Pinochle;
  constructor(id: string) {
    super(id);
  }
  public get gameInfo():any{
    return []
  }

  protected playerCount: number = 4;
  public rankValues = pinochleRankValues;

  protected startGame(): void{
    
  }
}

