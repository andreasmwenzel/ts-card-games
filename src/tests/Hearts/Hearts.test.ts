//"use strict";
import {
  HeartsPlayer,
  Hearts,
  HeartsGameInfo,
  HeartsGamePhase,
  HeartsPassDirection,
  HeartsPlayerInfo,
  GameState,
} from '../../index';
import seedrandom = require('seedrandom');

const gameID = 'Hearts1';
let game: Hearts;
let expectedGameInfo: HeartsGameInfo;

describe('Hearts game', () => {
  game = new Hearts(gameID);
  expectedGameInfo = {
    id: gameID,
    gameState: GameState.WAITING_FOR_PLAYERS,
    gamePhase: HeartsGamePhase.DEAL,
    players: [],
    passDirection: HeartsPassDirection.KEEP,
    rules: {
      players: 4,
      queenBreaksHearts: false,
      passingCount: 3,
    },
  };

  test('start new game', () => {
    expect(game.gameInfo).toEqual(expectedGameInfo);
  });

  const p0 = new HeartsPlayer('julie', '0');
  const p0Info: HeartsPlayerInfo = {
    name: 'julie',
    position: 0,
    isReady: false,
    leftTable: false,
    round: {
      hasPassed: false,
      points: 0,
      cardsPlayed: [],
      cardsTaken: [],
    },
    score: [],
  };

  const p1 = new HeartsPlayer('joe', '1');
  const p1Info: HeartsPlayerInfo = {
    name: 'joe',
    position: 1,
    isReady: false,
    leftTable: false,
    round: {
      hasPassed: false,
      points: 0,
      cardsPlayed: [],
      cardsTaken: [],
    },
    score: [],
  };

  const p2 = new HeartsPlayer('jim', '2');
  const p2Info: HeartsPlayerInfo = {
    name: 'jim',
    position: 2,
    isReady: false,
    leftTable: false,
    round: {
      hasPassed: false,
      points: 0,
      cardsPlayed: [],
      cardsTaken: [],
    },
    score: [],
  };

  const p3 = new HeartsPlayer('jessica', '3');
  const p3Info: HeartsPlayerInfo = {
    name: 'jessica',
    position: 3,
    isReady: false,
    leftTable: false,
    round: {
      hasPassed: false,
      points: 0,
      cardsPlayed: [],
      cardsTaken: [],
    },
    score: [],
  };

  test('add players', () => {
    p1.joinGame(game, 1);

    expectedGameInfo.players.push(p1Info);
    expect(game.gameInfo).toEqual(expectedGameInfo);

    p2.joinGame(game, 2);
    expectedGameInfo.players.push(p2Info);

    p3.joinGame(game, 3);
    expectedGameInfo.players.push(p3Info);

    p0.joinGame(game);
    expectedGameInfo.players.push(p0Info);
    expectedGameInfo.gameState = GameState.WAITING_FOR_START;
    expect(game.gameInfo).toEqual(expectedGameInfo);
  });

  test('starting the game', () => {
    p1.ready = true;
    p2.ready = true;
    p3.ready = true;
    seedrandom('hearts', {global: true});
    p0.ready = true;
    expectedGameInfo.players = expectedGameInfo.players.sort(
      (a, b) => a.position - b.position
    );
    expectedGameInfo.gameState = GameState.ACTIVE;
    expectedGameInfo.gamePhase = HeartsGamePhase.PASS;
    expectedGameInfo.passDirection = HeartsPassDirection.LEFT;

    expect(game.gameInfo).toEqual(expectedGameInfo);

    expect(p0.hand.map(a => a.description)).toStrictEqual([
      '3 of hearts',
      'K of spades',
      '6 of hearts',
      '6 of diamonds',
      '5 of hearts',
      '4 of spades',
      '7 of spades',
      'Q of hearts',
      'A of diamonds',
      '2 of diamonds',
      '10 of diamonds',
      '4 of diamonds',
      '9 of hearts',
    ]);
    expect(p1.hand.map(a => a.description)).toStrictEqual([
      '9 of clubs',
      '8 of spades',
      '5 of spades',
      'Q of diamonds',
      '4 of hearts',
      'K of hearts',
      '7 of diamonds',
      '4 of clubs',
      'J of clubs',
      '3 of clubs',
      '6 of clubs',
      '9 of diamonds',
      '6 of spades',
    ]);
    expect(p2.hand.map(a => a.description)).toStrictEqual([
      'Q of clubs',
      '2 of clubs',
      '2 of hearts',
      '5 of clubs',
      'J of hearts',
      '10 of spades',
      'A of hearts',
      '7 of hearts',
      'K of clubs',
      '10 of clubs',
      '3 of spades',
      '3 of diamonds',
      '2 of spades',
    ]);
    expect(p3.hand.map(a => a.description)).toStrictEqual([
      'A of clubs',
      'K of diamonds',
      'Q of spades',
      '7 of clubs',
      '8 of clubs',
      '10 of hearts',
      'J of spades',
      '9 of spades',
      '8 of diamonds',
      'J of diamonds',
      'A of spades',
      '8 of hearts',
      '5 of diamonds',
    ]);
    expectedGameInfo.gameState = GameState.ACTIVE;
  });

  test('passing cards', () => {
    expect(() => {
      p0.playCard(p0.hand[0]);
    }).toThrow(/Playing Error: Not in the playing phase/);
    expect(() => {
      p0.passCards(p0.hand.slice(0, 4));
    }).toThrow(/Passing Error: Must pass/);
  });
});
