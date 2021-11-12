import {Card} from 'ts-cards';
import {Player} from './Player';
import {v4 as uuidv4} from 'uuid';
import {
  CardGameData,
  CardGameInfo,
  GameState,
  PlayerData,
  PlayerInfo,
  CardGameParams,
} from './types';
import {PlayerParams} from '.';

export abstract class CardGame {
  protected gameData: CardGameData;

  constructor({id, name, data}: CardGameParams) {
    if (data) {
      this.gameData = data;
    } else {
      this.gameData = {
        id: id ? id : uuidv4(),
        name: name ? name : uuidv4(),
        players: [],
        gameState: GameState.WAITING_FOR_PLAYERS,
        rules: {
          players: 4,
        },
      };
    }
  }

  public get maxPlayers() {
    return this.gameData.rules.players;
  }
  public get gameState(): GameState {
    return this.gameData.gameState;
  }
  public get id(): string {
    return this.gameData.id;
  }

  public get name(): string {
    return this.gameData.name;
  }

  public get playersInfo(): ReadonlyArray<PlayerInfo> {
    const players: Array<PlayerInfo> = [];
    for (const p of this.gameData.players) {
      const player: PlayerInfo = {
        name: p.player.name,
        position: p.position,
        isReady: p.isReady,
        leftTable: p.leftTable,
      };
      players.push(player);
    }
    return players;
  }

  public abstract get gameInfo(): CardGameInfo;

  protected abstract startGame(): void;

  //individual player info checks
  public playerPosition(player: Player): number {
    return this.findPlayerData(this.gameData.players, player).position;
  }
  public playerHand(player: Player): Card[] {
    return this.findPlayerData(this.gameData.players, player).hand;
  }
  public isPlayerReady(player: Player): boolean {
    return this.findPlayerData(this.gameData.players, player).isReady;
  }
  public abstract addPlayer({name, id}: PlayerParams): Player;
  //Player and Game interactions
  protected addPlayerToGame<T extends Player>(
    player: T,
    position = -1
  ): PlayerData {
    if (this.gameState !== GameState.WAITING_FOR_PLAYERS) {
      throw new Error('Join Error: Game is full');
    }
    if (
      !Number.isInteger(position) ||
      position >= this.gameData.rules.players ||
      position < -1
    ) {
      throw new Error(
        `Join Error: Table has integer positions 0 through ${
          this.gameData.rules.players - 1
        } or use -1 to find open seat`
      );
    }

    let pos: number = position;
    if (position === -1) {
      //find the first available position
      const positions: number[] = [];
      for (const p of this.gameData.players) {
        positions.push(p.position);
      }
      positions.sort();
      for (let i = 0; i < this.gameData.rules.players; i++) {
        if (positions[i] !== i) {
          pos = i;
          break;
        }
      }
    } else {
      if (this.playerAtPosition(this.gameData.players, pos)) {
        throw new Error('Join Error: Position is occupied');
      }
    }

    const newPlayerData: PlayerData = {
      player: player,
      name: player.name,
      hand: [],
      position: pos,
      isReady: false,
      leftTable: false,
    };
    this.gameData.players.push(newPlayerData);
    if (this.gameData.players.length === this.gameData.rules.players) {
      this.gameData.gameState = GameState.WAITING_FOR_START;
    }

    return newPlayerData;
  }

  public playerReady(player: Player, ready: boolean): void {
    if (
      this.gameState === GameState.ACTIVE ||
      this.gameState === GameState.FINISHED
    )
      return;

    const playerData = this.findPlayerData(this.gameData.players, player);
    if (playerData.leftTable) return;

    playerData.isReady = ready;
    if (this.gameState === GameState.WAITING_FOR_PLAYERS) return;

    if (this.allPlayersReady()) {
      if (this.gameData.gameState === GameState.WAITING_FOR_START) {
        this.gameData.players.sort((a, b) =>
          a.position > b.position ? 1 : -1
        );
        this.startGame();
      }
      this.gameData.gameState = GameState.ACTIVE;
    }
  }
  public removePlayer(player: Player): number {
    this.gameData.players = this.gameData.players.filter(
      pd => pd.player !== player
    );
    player.setGame(undefined);

    switch (this.gameState) {
      case GameState.WAITING_FOR_PLAYERS:
        break;
      case GameState.WAITING_FOR_START: {
        this.gameData.gameState = GameState.WAITING_FOR_PLAYERS;
        break;
      }
      default:
        this.gameData.gameState = GameState.FINISHED;
    }
    return this.gameData.players.length;
  }
  public playerLeave(player: Player) {
    const leavingPlayerData = this.findPlayerData(
      this.gameData.players,
      player
    );
    leavingPlayerData.leftTable = true;
    leavingPlayerData.isReady = false;

    if (this.gameState === GameState.ACTIVE)
      this.gameData.gameState = GameState.WAITING_FOR_RESTART;
  }

  public playerRejoin(player: Player) {
    const pData = this.findPlayerData(this.gameData.players, player);
    pData.leftTable = false;
  }

  protected findPlayerData<T extends PlayerData>(data: T[], player: Player): T {
    const playerData = data.find(element => element.player === player);
    if (!playerData) {
      throw new Error(
        `Find Player Error: player ${player.name} is not in game ${this.gameData.id}`
      );
    }
    return playerData;
  }

  protected playerAtPosition<T extends PlayerData>(
    data: T[],
    position: number
  ): T | undefined {
    return data.find(p => p.position === position);
  }
  //All Players Ready and All Players Left checks
  private allPlayersReady(): boolean {
    for (const p of this.gameData.players) {
      if (!p.isReady) {
        return false;
      }
    }
    return true;
  }

  //Cards and Player Interactions
  protected removeCardFromPlayer(playerData: PlayerData, card: Card) {
    playerData.hand = playerData.hand.filter(obj => obj !== card);
  }
  protected removeCardsFromPlayer(playerData: PlayerData, cards: Card[]) {
    for (const card of cards) {
      this.removeCardFromPlayer(playerData, card);
    }
  }
  protected addCardToPlayer(playerData: PlayerData, card: Card) {
    playerData.hand.push(card);
  }
  protected addCardsToPlayer(playerData: PlayerData, cards: Card[]) {
    for (const card of cards) {
      this.addCardToPlayer(playerData, card);
    }
  }
}
