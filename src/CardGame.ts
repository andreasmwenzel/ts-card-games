import { Player } from "./Player";

export enum GameState {
  WAITING_FOR_PLAYERS,
  WAITING_FOR_START,
  ACTIVE,
  PAUSED,
}

export abstract class CardGame {
  public readonly id: string;
  public readonly players: Player[] = [];
  
  protected _gameState: GameState;
  public get gameState(): GameState {return this._gameState;}
  
  protected abstract playerCount: number;
  
  constructor(id: string) {
    this.id = id;
    this._gameState = GameState.WAITING_FOR_PLAYERS;
  }

  public abstract get gameInfo(): any;

  public joinGame(player: Player, position:number=-1):number {
    if (this._gameState != GameState.WAITING_FOR_PLAYERS) {
      throw new Error("Join Error: Game is full");
    }
    if(position >= this.playerCount || position < -1){
      throw new Error(`Join Error: Table on has positions 0 through ${this.playerCount-1} or use -1 to find open seat`)
    }
    let pos:number = position;
    if(position == -1){ //find the first available position
      let positions:number[] = []
      for(let p of this.players){
        positions.push(p.position);
      }
      positions.sort();
      for(let i = 0; i<this.playerCount; i++){
        console.log(positions)
        if(positions[i]!=i){
          pos = i;
          break;
        }
      }
    }
    else{
      for(let p of this.players){
        if(p.position === position){
          throw new Error(`Join Error: ${p.name} is already at position ${position}`)
        }
      }
    }
    
    
    this.players.push(player);
    if(this.players.length == this.playerCount){
      this._gameState = GameState.WAITING_FOR_START;
    }

    return pos;
  }

  public movePosition(player:Player, position:number, tradePositions:boolean = false, tradedPosition:number = -1){
    //player is not in this game
    if(this.players.indexOf(player) < 0 ){
      throw new Error(`Move Position Error: player ${player.name} is not in game ${this.id}`);
    }
    //player already in the seat
    for(let p of this.players){
      if(p.position === position){
        if(tradePositions){
          p.movePosition(tradedPosition);
        }
        else{
          throw new Error(`Move Position Error: player ${p.name} is already at position ${position}`);
        }
      }
    }
  }

  protected abstract startGame() : void;

  public playerReady(player:Player, ready:boolean):void{
    console.log(`${player.name} is ${ready ? "": "no longer"} ready`);
    if(this._gameState === GameState.WAITING_FOR_START && this.allPlayersReady()){
      this.players.sort((a,b)=>(a.position > b.position) ? 1 : -1);
      this._gameState = GameState.ACTIVE;
      this.startGame();
    }
  }

  public playerLeave(player:Player):number{
    switch (this._gameState){
      case GameState.ACTIVE:{
        this._gameState = GameState.PAUSED;
        //TODO: Pause the game
      }
      case GameState.WAITING_FOR_START:{
        this._gameState = GameState.WAITING_FOR_PLAYERS
      }
    }
    this.players.filter(p => p != player)
    console.log(`${player.name} has left the game`)
    return this.players.length;
  }

  private allPlayersReady() : boolean{
    for(let player of this.players){
      if(player.isReady != true){
        return false;
      }
    }
    return true;
  }
}

