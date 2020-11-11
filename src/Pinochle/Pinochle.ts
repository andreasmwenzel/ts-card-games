import {CardGame} from "../CardGame";
import { Card, RankValues } from "../cards";
import { Player } from "../Player";
import { PinochlePlayer } from "./PinochlePlayer";

export class Pinochle extends CardGame {
  public players: PinochlePlayer[] = [];
  constructor(id: string) {
    super(id);
  }
  public get gameInfo():any{
    return []
  }

  protected playerCount: number = 4;
  public rankValues = pinnochleRankValues;

  protected startGame(): void{
    
  }
}

let pinnochleRankValues:RankValues = {
  "2":0,
  "3":0,
  "4":0,
  "5":0,
  "6":0,
  "7":0,
  "8":0,
  "9":9,
  "J":10,
  "Q":11,
  "K":12,
  "10":13,
  "A":14,
}
