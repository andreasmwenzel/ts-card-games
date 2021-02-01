
import { CardGame } from "./CardGame"
import { SuitValues, Card } from "./cards"


export abstract class Player {

  public readonly name: string;
  public readonly id: string;

  protected abstract _game?: CardGame;
  public suitValues:SuitValues=defaultSuitValue;

  get position(){return this._game?.playerPosition(this)}
  get hand():ReadonlyArray<Card>{
    const hand = this._game?.playerHand(this)
    return hand ? hand : [];
  }
  get ready():boolean{
    const isReady = this._game?.isPlayerReady(this)
    return isReady ? isReady : false;
  }

  set ready(ready:boolean){
    this._game?.playerReady(this, ready);
  }

  get game():string{
    return this._game?.id ? this._game.id : "no game";
  }
  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }

  public leaveGame() {
    this._game?.playerLeave(this);
    this._game = undefined;
  }

  public joinGame(game:CardGame, position:number = -1){
    game.addPlayer(this, position);
    this._game = game;
  }

  public movePosition(position:number, tradePositions: boolean = false){
    if(this._game === undefined){
      throw new Error(`Move Position Error: Player ${this.name} is not assigned to a game`)
    }
    this._game?.movePosition(this, position, tradePositions);
  }
}

let defaultSuitValue:SuitValues = {
  clubs:0,
  diamonds:1,
  spades:2,
  hearts:3
}