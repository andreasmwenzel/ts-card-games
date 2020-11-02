import {CardGame} from "../CardGame";
import { Card } from "../cards";
import { PinochlePlayer } from "./PinochlePlayer";

export class Pinochle extends CardGame {
  constructor(id: string) {
    super(id);
  }
  public get gameInfo():any{
    return []
  }

  protected playerCount: number = 4;


  protected startGame(): void{
    
  }
}
