import {Deck} from 'ts-cards';
import {PinochlePlayer} from '.';
import {CardGameInfo, CardGameRules, PlayerData, PlayerInfo} from '..';

export type HeartsGameRules = CardGameRules;

export interface PinochlePlayerData extends PlayerData {
  player: PinochlePlayer;
  score: number[];
}

export interface PinochlePlayerInfo extends PlayerInfo {
  score: number[];
}

export interface PinochleGameInfo extends CardGameInfo {
  players: PinochlePlayerInfo[];
  rules: HeartsGameRules;
  round: HeartsGameRoundInfo;
}
export interface HeartsGameRoundInfo {
  positionToLead: number;
  positionToPlay: number;
  firstTrick: boolean;
  heartsBroken: boolean;
}

export interface PinochleGameData extends PinochleGameInfo {
  players: PinochlePlayerData[];
  deck: Deck;
  dealer: number;
}

export interface PinochleParams {
  id?: string;
  name?: string;
  data?: PinochleGameData;
}
