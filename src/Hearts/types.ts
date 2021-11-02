import {Card, Deck} from 'ts-cards';
import {HeartsPlayer} from '.';
import {CardGameInfo, CardGameRules, PlayerData, PlayerInfo} from '../types';

export enum HeartsGamePhase {
  DEAL = 'Deal',
  PASS = 'Pass',
  PLAY = 'Play',
}
export enum HeartsPassDirection {
  LEFT = 'Left',
  RIGHT = 'Right',
  ACROSS = 'Across',
  KEEP = 'Keep',
}

export interface HeartsGameRules extends CardGameRules {
  players: number;
  queenBreaksHearts: boolean;
  passingCount: number;
  playTo: number;
}

export interface HeartsPlayerData extends PlayerData {
  player: HeartsPlayer;
  score: number[];
  round: HeartsPlayerRoundData;
}

export interface HeartsPlayerRoundData extends HeartsPlayerRoundInfo {
  cardsDealt: Card[];
  cardsPassed: Card[];
  cardsReceived: Card[];
}

export interface HeartsPlayerRoundInfo {
  hasPassed: boolean;
  points: number;
  cardsTaken: Card[];
  cardsPlayed: Card[];
}

export interface HeartsPlayerInfo extends PlayerInfo {
  score: number[];
  round: HeartsPlayerRoundInfo;
}

export interface HeartsGameInfo extends CardGameInfo {
  gamePhase: HeartsGamePhase;
  passDirection: HeartsPassDirection;
  players: HeartsPlayerInfo[];
  rules: HeartsGameRules;
  round: HeartsGameRoundInfo;
}
export interface HeartsGameRoundInfo {
  positionToLead: number;
  positionToPlay: number;
  firstTrick: boolean;
  heartsBroken: boolean;
}

export interface HeartsGameData extends HeartsGameInfo {
  gamePhase: HeartsGamePhase;
  players: HeartsPlayerData[];
  deck: Deck;
  dealer: number;
}

export interface HeartsParams {
  id?: string;
  name?: string;
  data?: HeartsGameData;
}
