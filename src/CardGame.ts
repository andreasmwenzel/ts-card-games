//import { Card } from "cards" ;
import { Player } from "./Player";

enum GameState {
  WAITING_FOR_PLAYERS,
  WAITING_FOR_START,
  ACTIVE,
}

export abstract class CardGame {
  public id: string;
  public players: Player[] = [];
  private gameState: GameState = GameState.WAITING_FOR_PLAYERS;
  protected abstract playerCount: number;
  protected abstract subscribeToPlayerEvents(player: Player): void;
  constructor(id: string) {
    this.id = id;
  }

  joinGame(player: Player) {
    if (this.gameState != GameState.WAITING_FOR_PLAYERS) {
      throw new Error("Cannot Join Game, Game is full");
    }

    this.subscribeToUserEvents(player);
    this.subscribeToPlayerEvents(player);

    this.players.push(player);
    player.game = this.id;
  }

  startGame() {
    if (this.gameState == GameState.WAITING_FOR_PLAYERS) {
      throw new Error("Not enough players");
    }
    if (this.gameState == GameState.WAITING_FOR_START) {
      throw new Error("Not all players are ready");
    }
  }
  abstract playCard(): void;

  private subscribeToUserEvents(player: Player) {
    player.events.leave.on(() => {
      console.log("leave");
    });
    
  }
}

