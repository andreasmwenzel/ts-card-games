import {Card} from 'ts-cards';
import {Player} from './Player';
import {v4 as uuidv4} from 'uuid';
import {
  CardGameData,
  CardGameInfo,
  GameState,
  PlayerData,
  PlayerInfo,
} from './types';

export abstract class CardGame {
  protected gameData: CardGameData;

  constructor(id?: string, data?: CardGameData) {
    if (data) {
      this.gameData = data;
    } else {
      this.gameData = {
        id: id ? id : uuidv4(),
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

  public get players(): ReadonlyArray<PlayerInfo> {
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

  //Player and Game interactions
  public addPlayer(player: Player, position = -1): number {
    if (this.gameData.gameState === GameState.FINISHED) {
      throw new Error('Join Error: Game has finished');
    }
    if (
      !(
        this.gameData.gameState === GameState.WAITING_FOR_PLAYERS ||
        this.gameData.gameState === GameState.PLAYER_MISSING
      )
    ) {
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
    if (this.gameState === GameState.PLAYER_MISSING) {
      let p: PlayerData;
      try {
        p = this.findPlayerData(this.gameData.players, player);
      } catch {
        throw new Error('Join Error: Game is full');
      }
      p.leftTable = false;
      if (this.allPlayersRejoined()) {
        this.gameData.gameState = GameState.WAITING_FOR_RESTART;
      }
      return p.position;
    }

    let pos: number = position;
    if (position === -1) {
      //find the first available position
      const positions: number[] = [];
      for (const p of this.gameData.players) {
        if (p.player === player) {
          throw new Error(
            `Join Error: Player ${player.name} is already in this game`
          );
        }
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
      for (const p of this.gameData.players) {
        if (p.position === position) {
          throw new Error(
            `Join Error: ${p.player.name} is already at position ${position}`
          );
        }
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

    return pos;
  }
  public movePosition(
    player: Player,
    position: number,
    tradePositions = false
  ) {
    if (
      !Number.isInteger(position) ||
      position >= this.gameData.rules.players ||
      position < 0
    ) {
      throw new Error(
        `Move Position Error: Table has integer positions 0 through ${
          this.gameData.rules.players - 1
        }`
      );
    }
    if (
      !(
        this.gameState === GameState.WAITING_FOR_PLAYERS ||
        this.gameState === GameState.WAITING_FOR_START
      )
    ) {
      throw new Error('Move Position Error: Game has started');
    }
    const p = this.findPlayerData(this.gameData.players, player);
    if (p.position === position) {
      //move player to position (s)he's already in: nothing changes
      return;
    }

    //find person in position to move to
    const tradingPlayerData = this.gameData.players.find(
      pd => pd.position === position
    );
    if (tradingPlayerData === undefined) {
      //no player at that position
      p.position = position;
    } else {
      if (tradePositions) {
        tradingPlayerData.position = p.position;
        p.position = position;
      } else {
        throw new Error(
          `Move Position Error: player ${p.player.name} is already at position ${position}`
        );
      }
    }
  }

  public playerReady(player: Player, ready: boolean): void {
    if (this.gameState === GameState.ACTIVE) {
      throw new Error('Player Ready Error: Game is active');
    }
    if (this.gameState === GameState.FINISHED) {
      throw new Error('Player Ready Error: Game has finished');
    }
    const playerData = this.findPlayerData(this.gameData.players, player);
    if (playerData.leftTable) {
      throw new Error('Player Ready Error: Player has left the table');
    }
    playerData.isReady = ready;
    if (
      this.gameData.gameState === GameState.WAITING_FOR_START ||
      this.gameData.gameState === GameState.WAITING_FOR_RESTART
    ) {
      if (this.allPlayersReady()) {
        for (const p of this.gameData.players) {
          //reset ready flags
          p.isReady = false;
        }
        if (this.gameData.gameState === GameState.WAITING_FOR_START) {
          this.gameData.players.sort((a, b) =>
            a.position > b.position ? 1 : -1
          );
          this.startGame();
        }
        this.gameData.gameState = GameState.ACTIVE;
      }
    }
  }
  public removePlayer(player: Player): number {
    switch (this.gameData.gameState) {
      case GameState.WAITING_FOR_RESTART:
      case GameState.ACTIVE:
        this.gameData.gameState = GameState.PLAYER_MISSING;
        this.setPlayerLeft(player);
        break;
      case GameState.PLAYER_MISSING: {
        this.setPlayerLeft(player);
        if (this.allPlayersLeft()) {
          this.gameData.gameState = GameState.FINISHED;
        }
        break;
      }
      case GameState.WAITING_FOR_START:
        this.gameData.gameState = GameState.WAITING_FOR_PLAYERS;
        this.gameData.players = this.gameData.players.filter(
          pd => pd.player !== player
        );
        break;
      case GameState.WAITING_FOR_PLAYERS: {
        this.gameData.players = this.gameData.players.filter(
          pd => pd.player !== player
        );
      }
    }
    return this.gameData.players.length;
  }
  private setPlayerLeft(player: Player) {
    const leavingPlayerData = this.findPlayerData(
      this.gameData.players,
      player
    );
    leavingPlayerData.leftTable = true;
    leavingPlayerData.isReady = false;
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

  //All Players Ready and All Players Left checks
  private allPlayersReady(): boolean {
    for (const p of this.gameData.players) {
      if (!p.isReady) {
        return false;
      }
    }
    return true;
  }
  private allPlayersRejoined(): boolean {
    for (const p of this.gameData.players) {
      if (p.leftTable) {
        return false;
      }
    }
    return true;
  }
  private allPlayersLeft(): boolean {
    for (const p of this.gameData.players) {
      if (!p.leftTable) {
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
