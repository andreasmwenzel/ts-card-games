import {Card} from 'ts-cards';
import {Player} from '.';

export enum GameState {
  WAITING_FOR_PLAYERS = 'waiting for players',
  WAITING_FOR_START = 'waiting for start',
  ACTIVE = 'active',
  WAITING_FOR_RESTART = 'waiting for restart',
  FINISHED = 'finished',
}

export interface CardGameRules {
  players: number;
}
export interface CardGameData extends CardGameInfo {
  players: PlayerData[];
}

export interface PlayerInfo {
  name: string;
  position: number;
  isReady: boolean;
  leftTable: boolean;
}

export interface PlayerData extends PlayerInfo {
  player: Player;
  hand: Card[];
}

export interface CardGameParams {
  id?: string;
  name?: string;
  data?: CardGameData;
}

export interface CardGameInfo {
  id: string;
  name: string;
  gameState: GameState;
  players: PlayerInfo[];
  rules: CardGameRules;
}

export interface PlayerParams {
  name: string;
  id?: string;
}
