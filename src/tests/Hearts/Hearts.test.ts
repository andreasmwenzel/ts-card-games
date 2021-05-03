//"use strict";
import {
  HeartsPlayer,
  Hearts,
  HeartsGameInfo,
  HeartsGamePhase,
  HeartsPassDirection,
  GameState,
} from '../../index';

const gameID = 'Hearts1';
let game: Hearts;
let expectedGameInfo: HeartsGameInfo;

describe('Setting Up a game', () => {
  game = new Hearts(gameID);
  expectedGameInfo = {
    id: gameID,
    state: GameState.WAITING_FOR_PLAYERS,
    phase: HeartsGamePhase.DEAL,
    players: [],
    passDir: HeartsPassDirection.KEEP,
  };

  test('start new game', () => {
    expect(game.gameInfo).toEqual(expectedGameInfo);
  });

  const p1 = new HeartsPlayer('joe', '1');
  const p2 = new HeartsPlayer('jim', '2');
  const p3 = new HeartsPlayer('jessica', '3');
  const p4 = new HeartsPlayer('julie', '4');

  test('joining', () => {
    p1.joinGame(game, 1);
    expectedGameInfo.players.push({
      name: 'joe',
      position: 1,
      isReady: false,
      leftTable: false,
      roundPoints: undefined,
      score: undefined,
      totalPoints: undefined,
      hasPassed: undefined,
    });
    expect(game.gameInfo).toEqual(expectedGameInfo);
    p2.joinGame(game, 2);
    expectedGameInfo.players.push({
      name: 'jim',
      position: 2,
      isReady: false,
      leftTable: false,
      roundPoints: undefined,
      score: undefined,
      totalPoints: undefined,
      hasPassed: undefined,
    });
    expect(game.gameInfo).toEqual(expectedGameInfo);

    p3.joinGame(game);
    expectedGameInfo.players.push({
      name: 'jessica',
      position: 0,
      isReady: false,
      leftTable: false,
      roundPoints: undefined,
      score: undefined,
      totalPoints: undefined,
      hasPassed: undefined,
    });
    expect(game.gameInfo).toEqual(expectedGameInfo);

    p4.joinGame(game);
    expectedGameInfo.players.push({
      name: 'julie',
      position: 3,
      isReady: false,
      leftTable: false,
      roundPoints: undefined,
      score: undefined,
      totalPoints: undefined,
      hasPassed: undefined,
    });
    expectedGameInfo.state = GameState.WAITING_FOR_START;

    expect(game.gameInfo).toEqual(expectedGameInfo);
    console.log(game.gameInfo);
  });

  test('players ready', () => {
    p1.ready = true;
    p2.ready = true;
    p3.ready = true;
    p4.ready = true;
  });
});
