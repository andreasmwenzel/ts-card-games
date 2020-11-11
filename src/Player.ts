
import {CardGame} from "./CardGame"
import { Rank, Suit, Card, SuitValues, RankValues } from "./cards"

// export declare interface Player {
//   on(event: 'hello', listener: (name: string) => void): this;
//   on(event: string, listener: Function): this;
// }

export abstract class Player {

  public readonly name: string;
  public readonly id: string;

  private _game?: CardGame;
  public get game(){return this._game}

  private _position: number = -1;
  get position(){return this._position}

  private _isReady: boolean;
  get isReady(){return this._isReady}

  public suitValues:SuitValues=defaultSuitValue;
  

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
    this._isReady = false;
  }
  leaveGame() {
    this._game?.playerLeave(this);
    this._game = undefined;
  }
  public ready(ready:boolean = true){
    if(!this._game){
      throw new Error(`Ready Error: Player ${this.name} is not in a game.`)
    }
    this._game.playerReady(this, ready)
    this._isReady = ready;
  }
  public joinGame(game:CardGame, position:number = -1){
    try{
      this._position = game.joinGame(this, position);
      this._game = game;
    }catch (e){
      throw(e);
    }
    
  }

  public movePosition(position:number, tradePositions: boolean = false){
    if(this._game === undefined){
      throw new Error(`Move Position Error: Player ${this.name} is not assigned to a game`)
    }
    const prevPosition = this._position;
    try{
      if(tradePositions){
        this._position = -1;
      }
      this._game.movePosition(this, position, tradePositions, prevPosition);
    } catch(e){
      this._position = prevPosition;
      throw(e);
    }
    this._position = position;
  }
}

let defaultSuitValue:SuitValues = {
  clubs:0,
  diamonds:1,
  spades:2,
  hearts:3
}