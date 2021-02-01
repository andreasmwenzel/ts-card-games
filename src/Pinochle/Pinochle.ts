import {CardGame, PlayerData} from "../CardGame";
import { Card, pinochleRankValues } from "../cards";
import { Player } from "../Player";
import { PinochlePlayer } from "./PinochlePlayer";

export class Pinochle extends CardGame {
  protected _game?:Pinochle;

  protected playerData:PlayerData[] = [];

  constructor(id: string) {
    super(id);
  }
  public get gameInfo():any{
    return []
  }

  public addPlayer(player:Player, position:number):number{
    if(player instanceof PinochlePlayer){
      return super.addPlayer(player, position);
    } else{
      throw new Error("Join Game Error: Only Pinochle Players can join Pinochle games")
    }
  }

  protected playerCount: number = 4;
  public rankValues = pinochleRankValues;

  protected startGame(): void{
    
  }
}

