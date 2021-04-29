import { Card } from "ts-cards";
import { Player } from "./Player";

export enum GameState {
  WAITING_FOR_PLAYERS,
  WAITING_FOR_START,
  ACTIVE,
  PLAYER_MISSING,
  WAITING_FOR_RESTART,
  FINISHED
}

export interface PlayerData {
  player:Player
  hand:Card[]
  position:number
  isReady:boolean
  leftTable:boolean
}

export interface PlayerInfo{
  name:string,
  id:string,
  position:number,
  isReady:boolean;
  leftTable:boolean;
}


export abstract class CardGame {
  public readonly id: string;
  public get maxPlayers(){return this.playerCount}
  public get gameState(): GameState {return this._gameState;}
  
  public get players():ReadonlyArray<PlayerInfo>{
    let players:Array<PlayerInfo> = [];
    for(let p of this.playerData){
      let player:PlayerInfo = {
        name:p.player.name,
        id:p.player.id,
        position:p.position,
        isReady:p.isReady,
        leftTable:p.leftTable
      }
      players.push(player);
    }
    return players;
  }

  protected abstract playerData: PlayerData[];
  protected _gameState: GameState;
  protected abstract playerCount: number;
  
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
    if(this._gameState == GameState.FINISHED){
      throw new Error("Join Error: Game has finished");
    }
    if (!(this._gameState == GameState.WAITING_FOR_PLAYERS || this._gameState == GameState.PLAYER_MISSING)) {
      throw new Error("Join Error: Game is full");
    }
    if( !Number.isInteger(position) || position >= this.playerCount || position < -1){
      throw new Error(`Join Error: Table has integer positions 0 through ${this.playerCount-1} or use -1 to find open seat`)
    }
    if(this.gameState == GameState.PLAYER_MISSING){
      let p:PlayerData;
      try{
        p = this.findPlayerData(this.playerData, player)
      }
      catch{
        throw new Error("Join Error: Game is full");
      }
      p.leftTable = false;
      if(this.allPlayersRejoined()){
        this._gameState = GameState.WAITING_FOR_RESTART
      }
      return p.position;
    }
    
    let pos:number = position;
    if(position == -1){ //find the first available position
      let positions:number[] = []
      for(let p of this.playerData){
        if(p.player == player){
          throw new Error(`Join Error: Player ${player.name} is already in this game`)
        }
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
      isReady: false,
      leftTable: false
    }
    this.playerData.push(newPlayerData);
    if(this.playerData.length == this.playerCount){
      this._gameState = GameState.WAITING_FOR_START;
    }

    return pos;
  }

  public movePosition(player:Player, position:number, tradePositions:boolean = false){
    if( !Number.isInteger(position) || position >= this.playerCount || position < 0){
      throw new Error(`Move Position Error: Table has integer positions 0 through ${this.playerCount-1}`)
    }
    if(! (this.gameState == GameState.WAITING_FOR_PLAYERS || this.gameState == GameState.WAITING_FOR_START) ){
      throw new Error(`Move Position Error: Game has started`)
    }
    let p = this.findPlayerData(this.playerData, player);
    if(p.position == position){ //move player to position (s)he's already in: nothing changes
      return;
    }
    
    //find person in position to move to
    let tradingPlayerData = this.playerData.find(pd=>pd.position==position)
    if(tradingPlayerData === undefined){ //no player at that position
      p.position = position;
    }else{
      if(tradePositions){
        tradingPlayerData.position = p.position;
        p.position = position
      }else{
        throw new Error(`Move Position Error: player ${p.player.name} is already at position ${position}`);
      }
    }
    
  }

  protected abstract startGame() : void;

  public playerReady(player:Player, ready:boolean):void{
    if(this.gameState == GameState.ACTIVE){
      throw new Error("Player Ready Error: Game is active")
    }
    if(this.gameState == GameState.FINISHED){
      throw new Error("Player Ready Error: Game has finished")
    }
    const playerData = this.findPlayerData(this.playerData, player);
    if(playerData.leftTable){
      throw new Error("Player Ready Error: Player has left the table")
    }
    playerData.isReady=ready;
    if(this._gameState === GameState.WAITING_FOR_START || this._gameState === GameState.WAITING_FOR_RESTART){
      if(this.allPlayersReady()){
        for(let p of this.playerData){ //reset ready flags
          p.isReady=false;
        }
        if(this._gameState == GameState.WAITING_FOR_START){
          this.playerData.sort((a,b)=>(a.position > b.position) ? 1 : -1);
          this.startGame();
        }
        this._gameState = GameState.ACTIVE;
      }
    }
  }

  public removePlayer(player:Player):number{
    switch (this._gameState){
      case GameState.WAITING_FOR_RESTART:
      case GameState.ACTIVE:{
        this._gameState = GameState.PLAYER_MISSING;
      }
      case GameState.PLAYER_MISSING:{
        const leavingPlayerData = this.findPlayerData(this.playerData, player);
        leavingPlayerData.leftTable = true;
        leavingPlayerData.isReady = false;
        if(this.allPlayersLeft()){
          this._gameState = GameState.FINISHED;
        }
        break;
      }
      case GameState.WAITING_FOR_START:
        this._gameState = GameState.WAITING_FOR_PLAYERS;
      case GameState.WAITING_FOR_PLAYERS:{
        this.playerData = this.playerData.filter(pd => pd.player !== player);
        break;
      }
    }
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
      if(!p.isReady){
        return false;
      }
    }
    return true;
  }

  private allPlayersRejoined(){
    for(let p of this.playerData){
      if(p.leftTable){
        return false;
      }
    }
    return true;
  }
  private allPlayersLeft(){
    for(let p of this.playerData){
      if(!p.leftTable){
        return false;
      }
    }
    return true;
  }

  protected removeCardFromPlayer(playerData:PlayerData, card:Card){
    playerData.hand = playerData.hand.filter(obj => obj !== card);
  }
  protected addCardsToPlayer(playerData:PlayerData, cards:Card[]){
    for(const card of cards){
      playerData.hand.push(card);
    }
  }
}
