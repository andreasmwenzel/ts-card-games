import { Card, RankValues } from "./cards";
import { Player } from "./Player";

export enum GameState {
  WAITING_FOR_PLAYERS,
  WAITING_FOR_START,
  ACTIVE,
  PAUSED,
  FINISHED
}

export interface PlayerData {
  player:Player
  hand:Card[]
  position:number
  isReady:boolean
}

export interface PlayerInfo{
  name:string,
  id:string,
  position:number
}


export abstract class CardGame {
  public readonly id: string;
  protected abstract playerData: PlayerData[];
  
  public get players():ReadonlyArray<PlayerInfo>{
    let players:Array<PlayerInfo> = [];
    for(let p of this.playerData){
      let player:PlayerInfo = {
        name:p.player.name,
        id:p.player.id,
        position:p.position
      }
      players.push(player);
    }
    return players;
  }

  protected _gameState: GameState;
  public get gameState(): GameState {return this._gameState;}
  
  protected abstract playerCount: number;
  public get maxPlayers(){return this.playerCount}

  public abstract rankValues: RankValues;
  
  constructor(id: string) {
    this.id = id;
    this._gameState = GameState.WAITING_FOR_PLAYERS;
  }

  public abstract get gameInfo(): any;

  public playerPosition(player:Player){
    return this.findPlayerData(this.playerData, player).position;
  }

  public playerHand(player:Player):Card[]{
    return this.findPlayerData(this.playerData, player).hand;
  }
  public isPlayerReady(player:Player){
    return this.findPlayerData(this.playerData, player).isReady;
  }

  public addPlayer(player: Player, position:number=-1):number {
    if (this._gameState != GameState.WAITING_FOR_PLAYERS) {
      throw new Error("Join Error: Game is full");
    }
    if( !Number.isInteger(position) || position >= this.playerCount || position < -1){
      throw new Error(`Join Error: Table has integer positions 0 through ${this.playerCount-1} or use -1 to find open seat`)
    }
    let pos:number = position;
    if(position == -1){ //find the first available position
      let positions:number[] = []
      for(let p of this.playerData){
        positions.push(p.position);
      }
      positions.sort();
      for(let i = 0; i<this.playerCount; i++){
        if(positions[i]!=i){
          pos = i;
          break;
        }
      }
    }
    else{
      for(let p of this.playerData){
        if(p.position === position){
          throw new Error(`Join Error: ${p.player.name} is already at position ${position}`)
        }
      }
    }
    
    let newPlayerData:PlayerData = {
      player:player,
      hand:[],
      position:pos,
      isReady: false
    }
    this.playerData.push(newPlayerData);
    if(this.playerData.length == this.playerCount){
      this._gameState = GameState.WAITING_FOR_START;
    }

    return pos;
  }

  public movePosition(player:Player, position:number, tradePositions:boolean = false){
    if(!(this.gameState == GameState.WAITING_FOR_PLAYERS || this.gameState == GameState.WAITING_FOR_START)){
      throw new Error(`Move Position Error: game has started`)
    }
    let playerData = this.findPlayerData(this.playerData, player);
    let tradedPosition=playerData.position;
    playerData.position = position;
    //player already in the seat
    for(let p of this.playerData){
      if(p.player != player){
        if(p.position === position){
          if(tradePositions){
            this.movePosition(p.player, tradedPosition)
          }
          else{
            playerData.position = tradedPosition;
            throw new Error(`Move Position Error: player ${p.player.name} is already at position ${position}`);
          }
        }
      }
    }
  }

  protected abstract startGame() : void;

  public playerReady(player:Player, ready:boolean):void{
    if(!(this.gameState == GameState.WAITING_FOR_PLAYERS || this.gameState == GameState.WAITING_FOR_START)){
      throw new Error("Player Ready Error: Game has started")
    }
    const playerData = this.findPlayerData(this.playerData, player);
    playerData.isReady=ready;
    console.log(`${player.name} is ${ready ? "": "no longer"} ready`);
    if(this._gameState === GameState.WAITING_FOR_START && this.allPlayersReady()){
      this._gameState = GameState.ACTIVE;
      this.playerData.sort((a,b)=>(a.position > b.position) ? 1 : -1);
      this.startGame();
    }
  }

  public playerLeave(player:Player):number{
    switch (this._gameState){
      case GameState.ACTIVE:{
        this._gameState = GameState.PAUSED;
        //TODO: Pause the game and restart it when player rejoins
      }
      case GameState.WAITING_FOR_START:{
        this._gameState = GameState.WAITING_FOR_PLAYERS
      }
    }
    this.playerData.filter(p => p.player != player)
    console.log(`${player.name} has left the game`)
    return this.playerData.length;
  }

  protected findPlayerData<T extends PlayerData>(data: T[], player:Player):T{
    let playerData = data.find(element => element.player == player);
    if(!playerData){
      throw new Error(`Find Player Error: player ${player.name} is not in game ${this.id}`);
    }
    return playerData;
  }

  private allPlayersReady() : boolean{
    for(let p of this.playerData){
      if(p.isReady != true){
        return false;
      }
    }
    return true;
  }

  protected removeCardFromPlayer(playerData:PlayerData, card:Card){
    playerData.hand = playerData.hand.filter(obj => obj !== card);
  }
  protected addCardToPlayer(playerData:PlayerData, card:Card){
    playerData.hand.push(card);
  }
}
