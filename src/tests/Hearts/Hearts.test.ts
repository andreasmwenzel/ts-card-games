//"use strict";
import seedrandom = require('seedrandom');
import {
  Card,
  clubs,
  diamonds,
  four,
  hearts,
  spades,
  standardRankValues,
} from 'ts-cards';
import {Hearts, HeartsPlayer} from '../..';
import {GameState} from '../../types';
import {
  HeartsGameInfo,
  HeartsGamePhase,
  HeartsPassDirection,
  HeartsPlayerInfo,
} from '../../Hearts/types';

const gameID = 'Hearts1';
let game: Hearts;
let expectedGameInfo: HeartsGameInfo;

let p0: HeartsPlayer, p1: HeartsPlayer, p2: HeartsPlayer, p3: HeartsPlayer;

let p0Info: HeartsPlayerInfo,
  p1Info: HeartsPlayerInfo,
  p2Info: HeartsPlayerInfo,
  p3Info: HeartsPlayerInfo;

let testPlayers: HeartsPlayer[];

let twoOfClubs: Card,
  threeOfClubs: Card,
  fourOfClubs: Card,
  fiveOfClubs: Card,
  sixOfClubs: Card,
  sevenOfClubs: Card,
  eightOfClubs: Card,
  nineOfClubs: Card,
  tenOfClubs: Card,
  jOfClubs: Card,
  qOfClubs: Card,
  kOfClubs: Card,
  aOfClubs: Card,
  twoOfSpades: Card,
  threeOfSpades: Card,
  fourOfSpades: Card,
  fiveOfSpades: Card,
  sixOfSpades: Card,
  sevenOfSpades: Card,
  eightOfSpades: Card,
  nineOfSpades: Card,
  tenOfSpades: Card,
  jOfSpades: Card,
  qOfSpades: Card,
  kOfSpades: Card,
  aOfSpades: Card,
  twoOfDiamonds: Card,
  threeOfDiamonds: Card,
  fourOfDiamonds: Card,
  fiveOfDiamonds: Card,
  sixOfDiamonds: Card,
  sevenOfDiamonds: Card,
  eightOfDiamonds: Card,
  nineOfDiamonds: Card,
  tenOfDiamonds: Card,
  jOfDiamonds: Card,
  qOfDiamonds: Card,
  kOfDiamonds: Card,
  aOfDiamonds: Card,
  twoOfHearts: Card,
  threeOfHearts: Card,
  fourOfHearts: Card,
  fiveOfHearts: Card,
  sixOfHearts: Card,
  sevenOfHearts: Card,
  eightOfHearts: Card,
  nineOfHearts: Card,
  tenOfHearts: Card,
  jOfHearts: Card,
  qOfHearts: Card,
  kOfHearts: Card,
  aOfHearts: Card;

describe('Hearts game', () => {
  game = new Hearts({id: gameID, name: gameID});
  expectedGameInfo = {
    id: gameID,
    name: gameID,
    gameState: GameState.WAITING_FOR_PLAYERS,
    gamePhase: HeartsGamePhase.DEAL,
    players: [],
    passDirection: HeartsPassDirection.KEEP,
    rules: {
      players: 4,
      queenBreaksHearts: false,
      passingCount: 3,
      playTo: 100,
    },
    round: {
      heartsBroken: false,
      firstTrick: true,
      positionToLead: 0,
      positionToPlay: 0,
    },
  };

  test('start new game', () => {
    expect(game.gameInfo).toEqual(expectedGameInfo);
  });

  p0 = new HeartsPlayer({name: 'julie', id: '0'});
  p0Info = {
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

  p1 = new HeartsPlayer({name: 'joe', id: '1'});
  p1Info = {
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

  p2 = new HeartsPlayer({name: 'jim', id: '2'});
  p2Info = {
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

  p3 = new HeartsPlayer({name: 'jessica', id: '3'});
  p3Info = {
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

  testPlayers = [p0, p1, p2, p3];
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

    expect(p0.handLength).toEqual(13);
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
    threeOfHearts = p0.hand[0];
    kOfSpades = p0.hand[1];
    sixOfHearts = p0.hand[2];
    sixOfDiamonds = p0.hand[3];
    fiveOfHearts = p0.hand[4];
    fourOfSpades = p0.hand[5];
    sevenOfSpades = p0.hand[6];
    qOfHearts = p0.hand[7];
    aOfDiamonds = p0.hand[8];
    twoOfDiamonds = p0.hand[9];
    tenOfDiamonds = p0.hand[10];
    fourOfDiamonds = p0.hand[11];
    nineOfHearts = p0.hand[12];
    expect(game.getPlayerData(p0).round.cardsDealt).toStrictEqual([
      threeOfHearts,
      kOfSpades,
      sixOfHearts,
      sixOfDiamonds,
      fiveOfHearts,
      fourOfSpades,
      sevenOfSpades,
      qOfHearts,
      aOfDiamonds,
      twoOfDiamonds,
      tenOfDiamonds,
      fourOfDiamonds,
      nineOfHearts,
    ]);

    expect(p1.handLength).toEqual(13);
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
    nineOfClubs = p1.hand[0];
    eightOfSpades = p1.hand[1];
    fiveOfSpades = p1.hand[2];
    qOfDiamonds = p1.hand[3];
    fourOfHearts = p1.hand[4];
    kOfHearts = p1.hand[5];
    sevenOfDiamonds = p1.hand[6];
    fourOfClubs = p1.hand[7];
    jOfClubs = p1.hand[8];
    threeOfClubs = p1.hand[9];
    sixOfClubs = p1.hand[10];
    nineOfDiamonds = p1.hand[11];
    sixOfSpades = p1.hand[12];
    expect(game.getPlayerData(p1).round.cardsDealt).toStrictEqual([
      nineOfClubs,
      eightOfSpades,
      fiveOfSpades,
      qOfDiamonds,
      fourOfHearts,
      kOfHearts,
      sevenOfDiamonds,
      fourOfClubs,
      jOfClubs,
      threeOfClubs,
      sixOfClubs,
      nineOfDiamonds,
      sixOfSpades,
    ]);

    expect(p2.handLength).toEqual(13);
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
    qOfClubs = p2.hand[0];
    twoOfClubs = p2.hand[1];
    twoOfHearts = p2.hand[2];
    fiveOfClubs = p2.hand[3];
    jOfHearts = p2.hand[4];
    tenOfSpades = p2.hand[5];
    aOfHearts = p2.hand[6];
    sevenOfHearts = p2.hand[7];
    kOfClubs = p2.hand[8];
    tenOfClubs = p2.hand[9];
    threeOfSpades = p2.hand[10];
    threeOfDiamonds = p2.hand[11];
    twoOfSpades = p2.hand[12];
    expect(game.getPlayerData(p2).round.cardsDealt).toStrictEqual([
      qOfClubs,
      twoOfClubs,
      twoOfHearts,
      fiveOfClubs,
      jOfHearts,
      tenOfSpades,
      aOfHearts,
      sevenOfHearts,
      kOfClubs,
      tenOfClubs,
      threeOfSpades,
      threeOfDiamonds,
      twoOfSpades,
    ]);

    expect(p3.handLength).toEqual(13);
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
    aOfClubs = p3.hand[0];
    kOfDiamonds = p3.hand[1];
    qOfSpades = p3.hand[2];
    sevenOfClubs = p3.hand[3];
    eightOfClubs = p3.hand[4];
    tenOfHearts = p3.hand[5];
    jOfSpades = p3.hand[6];
    nineOfSpades = p3.hand[7];
    eightOfDiamonds = p3.hand[8];
    jOfDiamonds = p3.hand[9];
    aOfSpades = p3.hand[10];
    eightOfHearts = p3.hand[11];
    fiveOfDiamonds = p3.hand[12];
    expect(game.getPlayerData(p3).round.cardsDealt).toStrictEqual([
      aOfClubs,
      kOfDiamonds,
      qOfSpades,
      sevenOfClubs,
      eightOfClubs,
      tenOfHearts,
      jOfSpades,
      nineOfSpades,
      eightOfDiamonds,
      jOfDiamonds,
      aOfSpades,
      eightOfHearts,
      fiveOfDiamonds,
    ]);

    expectedGameInfo.gameState = GameState.ACTIVE;

    expect(game.cardPoints(twoOfClubs)).toBe(0);
    expect(game.cardPoints(qOfSpades)).toBe(13);
    expect(game.cardPoints(aOfHearts)).toBe(1);

    expect(p0.hasSuit(hearts)).toBe(true);
    expect(p0.hasOnlyHearts()).toBe(false);
    expect(p0.hasCard(four, spades)).toBe(true);
    expect(p2.hasCard(four, spades)).toBe(false);
    expect(p0.hasTwoOfClubs()).toBe(false);
    expect(p2.hasTwoOfClubs()).toBe(true);

    expect(game.getPlayerData(p0).round.cardsDealt).toStrictEqual(p0.hand);
    expect(game.getPlayerData(p1).round.cardsDealt).toStrictEqual(p1.hand);
    expect(game.getPlayerData(p2).round.cardsDealt).toStrictEqual(p2.hand);
    expect(game.getPlayerData(p3).round.cardsDealt).toStrictEqual(p3.hand);
  });

  test('passing cards', () => {
    expect(() => {
      p0.playCard(p0.hand[0]);
    }).toThrow(/Playing Error: Not in the playing phase/);
    expect(() => {
      p0.passCards(p0.hand.slice(0, 4));
    }).toThrow(/Passing Error: Must pass/);

    expect(() => {
      p0.passCards(p1.hand.slice(0, 3));
    }).toThrow(/Passing Error: player does not have that card/);

    const p0Pass = [kOfSpades, qOfHearts, aOfDiamonds];
    p0.passCards(p0Pass);
    expect(game.getPlayerData(p0).round.cardsPassed).toStrictEqual(p0Pass);
    p0Info.round.hasPassed = true;

    const p1Pass = [qOfDiamonds, kOfHearts, nineOfDiamonds];
    p1.passCards(p1Pass);
    expect(game.getPlayerData(p1).round.cardsPassed).toStrictEqual(p1Pass);
    p1Info.round.hasPassed = true;

    const p2Pass = [qOfClubs, aOfHearts, kOfClubs];
    p2.passCards(p2Pass);
    expect(game.getPlayerData(p2).round.cardsPassed).toStrictEqual(p2Pass);
    p2Info.round.hasPassed = true;

    const p3Pass = [kOfDiamonds, tenOfHearts, eightOfHearts];
    p3.passCards(p3Pass);
    expect(game.getPlayerData(p3).round.cardsPassed).toStrictEqual(p3Pass);
    p3Info.round.hasPassed = true;

    expectedGameInfo.gamePhase = HeartsGamePhase.PLAY;
    expectedGameInfo.round.positionToLead = 2;
    expectedGameInfo.round.positionToPlay = 2;
    expectedGameInfo.round.firstTrick = true;
    expect(game.gameInfo).toEqual(expectedGameInfo);
    expect([...p0.hand].sort(sortHeartsHand)).toStrictEqual([
      fourOfSpades,
      sevenOfSpades,
      twoOfDiamonds,
      fourOfDiamonds,
      sixOfDiamonds,
      tenOfDiamonds,
      kOfDiamonds,
      threeOfHearts,
      fiveOfHearts,
      sixOfHearts,
      eightOfHearts,
      nineOfHearts,
      tenOfHearts,
    ]);
    expect([...p1.hand].sort(sortHeartsHand)).toStrictEqual([
      threeOfClubs,
      fourOfClubs,
      sixOfClubs,
      nineOfClubs,
      jOfClubs,
      fiveOfSpades,
      sixOfSpades,
      eightOfSpades,
      kOfSpades,
      sevenOfDiamonds,
      aOfDiamonds,
      fourOfHearts,
      qOfHearts,
    ]);
    expect([...p2.hand].sort(sortHeartsHand)).toStrictEqual([
      twoOfClubs,
      fiveOfClubs,
      tenOfClubs,
      twoOfSpades,
      threeOfSpades,
      tenOfSpades,
      threeOfDiamonds,
      nineOfDiamonds,
      qOfDiamonds,
      twoOfHearts,
      sevenOfHearts,
      jOfHearts,
      kOfHearts,
    ]);
    expect([...p3.hand].sort(sortHeartsHand)).toStrictEqual([
      sevenOfClubs,
      eightOfClubs,
      qOfClubs,
      kOfClubs,
      aOfClubs,
      nineOfSpades,
      jOfSpades,
      qOfSpades,
      aOfSpades,
      fiveOfDiamonds,
      eightOfDiamonds,
      jOfDiamonds,
      aOfHearts,
    ]);

    expect(p0.hasSuit(clubs)).toBe(false);

    expect(game.getPlayerData(p0).round.cardsPassed).toStrictEqual(p0Pass);
    expect(game.getPlayerData(p1).round.cardsPassed).toStrictEqual(p1Pass);
    expect(game.getPlayerData(p2).round.cardsPassed).toStrictEqual(p2Pass);
    expect(game.getPlayerData(p3).round.cardsPassed).toStrictEqual(p3Pass);

    expect(game.getPlayerData(p0).round.cardsReceived).toStrictEqual(p3Pass);
    expect(game.getPlayerData(p1).round.cardsReceived).toStrictEqual(p0Pass);
    expect(game.getPlayerData(p2).round.cardsReceived).toStrictEqual(p1Pass);
    expect(game.getPlayerData(p3).round.cardsReceived).toStrictEqual(p2Pass);
  });
  test('playing a round', () => {
    expect(() => {
      game.startNewRound();
    }).toThrow(/New Round Error: Not in the right Gamephase/);
    expect(() => {
      p0.passCards([]);
    }).toThrow(/Passing Error: Not in the passing phase/);
    expect(() => {
      p0.playCard(p0.hand[0]);
    }).toThrow(/Playing Error: Not this player's turn/);
    expect(() => {
      p2.playCard(p0.hand[0]);
    }).toThrow(/Playing Error: player does not have that card/);

    expect(() => {
      p2.playCard(p2.hand[1]);
    }).toThrow(/Playing Error: first card must be a two of clubs/);

    playCard(p2, twoOfClubs, p2Info);
    expectedGameInfo.round.positionToPlay = 3;
    expect(game.gameInfo).toEqual(expectedGameInfo);

    expect(() => {
      p3.playCard(qOfSpades);
    }).toThrow(/Playing Error: Must Follow Suit/);
    expect(() => {
      p3.playCard(aOfHearts);
    }).toThrow(/Playing Error: Must Follow Suit/);

    playCard(p3, aOfClubs, p3Info);
    expectedGameInfo.round.positionToPlay = 0;
    expect(game.gameInfo).toEqual(expectedGameInfo);

    expect(() => {
      p0.playCard(p0.hand[0]);
    }).toThrow(/Playing Error: Cannot play points of first trick/);

    playCard(p0, sevenOfSpades, p0Info);
    playCard(p1, sixOfClubs, p1Info);

    p3Info.round.cardsTaken.push(
      twoOfClubs,
      aOfClubs,
      sevenOfSpades,
      sixOfClubs
    );

    expectedGameInfo.round.positionToLead = 3;
    expectedGameInfo.round.positionToPlay = 3;
    expectedGameInfo.round.firstTrick = false;

    expect(game.gameInfo).toStrictEqual(expectedGameInfo);
  });

  test('breaking hearts', () => {
    expect(() => {
      p3.playCard(aOfHearts);
    }).toThrow(/Playing Error: Hearts has not been broken/);

    playCard(p3, jOfDiamonds, p3Info);
    playCard(p0, kOfDiamonds, p0Info);
    playCard(p1, aOfDiamonds, p1Info);
    playCard(p2, qOfDiamonds, p2Info);

    p1Info.round.cardsTaken.push(
      jOfDiamonds,
      kOfDiamonds,
      aOfDiamonds,
      qOfDiamonds
    );
    expectedGameInfo.round.positionToLead = 1;
    expectedGameInfo.round.positionToPlay = 1;

    expect(game.gameInfo).toStrictEqual(expectedGameInfo);

    playCard(p1, sevenOfDiamonds, p1Info);
    expectedGameInfo.round.positionToPlay = 2;
    expect(game.gameInfo).toStrictEqual(expectedGameInfo);
    playCard(p2, nineOfDiamonds, p2Info);
    playCard(p3, eightOfDiamonds, p3Info);
    playCard(p0, tenOfDiamonds, p0Info);

    p0Info.round.cardsTaken.push(
      sevenOfDiamonds,
      nineOfDiamonds,
      eightOfDiamonds,
      tenOfDiamonds
    );

    playCard(p0, fourOfSpades, p0Info);
    playCard(p1, eightOfSpades, p1Info);
    playCard(p2, tenOfSpades, p2Info);
    playCard(p3, aOfSpades, p3Info);

    p3Info.round.cardsTaken.push(
      fourOfSpades,
      eightOfSpades,
      tenOfSpades,
      aOfSpades
    );

    expectedGameInfo.round.positionToLead = 3;
    expectedGameInfo.round.positionToPlay = 3;

    expect(game.gameInfo).toStrictEqual(expectedGameInfo);

    expect(p0.hasSuit(clubs)).toBe(false);
    expect(p0.hasSuit(spades)).toBe(false);

    playCard(p3, sevenOfClubs, p3Info);
    playCard(p0, tenOfHearts, p0Info);
    playCard(p1, fourOfClubs, p1Info);
    playCard(p2, fiveOfClubs, p2Info);

    p3Info.round.cardsTaken.push(
      sevenOfClubs,
      tenOfHearts,
      fourOfClubs,
      fiveOfClubs
    );
    p3Info.round.points += 1;

    expectedGameInfo.round.heartsBroken = true;
    expect(game.gameInfo).toStrictEqual(expectedGameInfo);

    playCard(p3, aOfHearts, p3Info);
    expect(() => {
      p0.playCard(twoOfDiamonds);
    }).toThrow(/Playing Error: Must Follow Suit/);
    playCard(p0, nineOfHearts, p0Info);
    playCard(p1, qOfHearts, p1Info);
    playCard(p2, jOfHearts, p2Info);

    p3Info.round.cardsTaken.push(aOfHearts, nineOfHearts, qOfHearts, jOfHearts);
    p3Info.round.points += 4;

    expect(game.gameInfo).toStrictEqual(expectedGameInfo);
    expect([...p3.hand].sort(sortHeartsHand)).toStrictEqual([
      eightOfClubs,
      qOfClubs,
      kOfClubs,
      nineOfSpades,
      jOfSpades,
      qOfSpades,
      fiveOfDiamonds,
    ]);

    playCard(p3, fiveOfDiamonds, p3Info);
    playCard(p0, sixOfDiamonds, p0Info);
    playCard(p1, fourOfHearts, p1Info);
    expect(() => {
      p2.playCard(kOfHearts);
    }).toThrow(/Playing Error: Must Follow Suit/);
    playCard(p2, threeOfDiamonds, p2Info);

    p0Info.round.cardsTaken.push(
      fiveOfDiamonds,
      sixOfDiamonds,
      fourOfHearts,
      threeOfDiamonds
    );
    p0Info.round.points += 1;

    expectedGameInfo.round.positionToLead = 0;
    expectedGameInfo.round.positionToPlay = 0;

    expect(game.gameInfo).toStrictEqual(expectedGameInfo);

    playCard(p0, twoOfDiamonds, p0Info);
    playCard(p1, kOfSpades, p1Info);
    playCard(p2, kOfHearts, p2Info);
    playCard(p3, qOfSpades, p3Info);

    p0Info.round.cardsTaken.push(
      twoOfDiamonds,
      kOfSpades,
      kOfHearts,
      qOfSpades
    );
    p0Info.round.points += 14;

    expect(game.gameInfo).toStrictEqual(expectedGameInfo);

    playCard(p0, fourOfDiamonds, p0Info);
    playCard(p1, jOfClubs, p1Info);
    playCard(p2, tenOfClubs, p2Info);
    playCard(p3, jOfSpades, p3Info);

    p0Info.round.cardsTaken.push(
      fourOfDiamonds,
      jOfClubs,
      tenOfClubs,
      jOfSpades
    );

    expect(p0.hasOnlyHearts()).toBe(true);

    playCard(p0, threeOfHearts, p0Info);
    playCard(p1, nineOfClubs, p1Info);
    playCard(p2, twoOfHearts, p2Info);
    playCard(p3, nineOfSpades, p3Info);

    p0Info.round.cardsTaken.push(
      threeOfHearts,
      nineOfClubs,
      twoOfHearts,
      nineOfSpades
    );
    p0Info.round.points += 2;

    expect(game.gameInfo).toStrictEqual(expectedGameInfo);

    playCard(p0, fiveOfHearts, p0Info);
    playCard(p1, threeOfClubs, p1Info);
    playCard(p2, sevenOfHearts, p2Info);
    playCard(p3, kOfClubs, p3Info);

    p2Info.round.cardsTaken.push(
      fiveOfHearts,
      threeOfClubs,
      sevenOfHearts,
      kOfClubs
    );
    p2Info.round.points += 2;
    expectedGameInfo.round.positionToLead = 2;
    expectedGameInfo.round.positionToPlay = 2;

    expect(game.gameInfo).toStrictEqual(expectedGameInfo);

    playCard(p2, threeOfSpades, p2Info);
    playCard(p3, qOfClubs, p3Info);
    playCard(p0, eightOfHearts, p0Info);
    playCard(p1, sixOfSpades, p1Info);

    p1Info.round.cardsTaken.push(
      threeOfSpades,
      qOfClubs,
      eightOfHearts,
      sixOfSpades
    );
    p1Info.round.points += 1;
    expectedGameInfo.round.positionToLead = 1;
    expectedGameInfo.round.positionToPlay = 1;

    expect(game.gameInfo).toStrictEqual(expectedGameInfo);

    playCard(p1, fiveOfSpades, p1Info);
    playCard(p2, twoOfSpades, p2Info);
    playCard(p3, eightOfClubs, p3Info);
    playCard(p0, sixOfHearts, p0Info);

    p1Info.round.cardsTaken.push(
      fiveOfSpades,
      twoOfSpades,
      eightOfClubs,
      sixOfHearts
    );
    p1Info.round.points += 1;

    expectedGameInfo.round.positionToPlay = 0;
    p0Info.score = [17];
    p1Info.score = [2];
    p2Info.score = [2];
    p3Info.score = [5];

    expectedGameInfo.gamePhase = HeartsGamePhase.DEAL;

    expect(game.gameInfo).toStrictEqual(expectedGameInfo);
  });
  test('shoot the moon', () => {
    seedrandom('round2', {global: true});
    game.startNewRound();
    expectedGameInfo.gamePhase = HeartsGamePhase.PASS;
    expectedGameInfo.passDirection = HeartsPassDirection.RIGHT;
    expectedGameInfo.round = {
      positionToLead: 0,
      positionToPlay: 0,
      heartsBroken: false,
      firstTrick: true,
    };

    p0Info.round = {
      hasPassed: false,
      points: 0,
      cardsTaken: [],
      cardsPlayed: [],
    };
    p1Info.round = {
      hasPassed: false,
      points: 0,
      cardsTaken: [],
      cardsPlayed: [],
    };
    p2Info.round = {
      hasPassed: false,
      points: 0,
      cardsTaken: [],
      cardsPlayed: [],
    };
    p3Info.round = {
      hasPassed: false,
      points: 0,
      cardsTaken: [],
      cardsPlayed: [],
    };

    expect(game.gameInfo).toStrictEqual(expectedGameInfo);
    expect([...p0.hand].sort(sortHeartsHand)).toStrictEqual([
      fourOfClubs,
      qOfClubs,
      kOfClubs,
      threeOfSpades,
      fourOfSpades,
      fiveOfSpades,
      sevenOfSpades,
      eightOfSpades,
      tenOfSpades,
      kOfSpades,
      eightOfDiamonds,
      qOfDiamonds,
      qOfHearts,
    ]);
    expect([...p1.hand].sort(sortHeartsHand)).toStrictEqual([
      fiveOfClubs,
      jOfClubs,
      aOfClubs,
      sixOfSpades,
      nineOfSpades,
      qOfSpades,
      twoOfDiamonds,
      fourOfDiamonds,
      sixOfDiamonds,
      twoOfHearts,
      sixOfHearts,
      jOfHearts,
      kOfHearts,
    ]);
    expect([...p2.hand].sort(sortHeartsHand)).toStrictEqual([
      sixOfClubs,
      eightOfClubs,
      tenOfClubs,
      jOfSpades,
      sevenOfDiamonds,
      jOfDiamonds,
      kOfDiamonds,
      aOfDiamonds,
      fiveOfHearts,
      eightOfHearts,
      nineOfHearts,
      tenOfHearts,
      aOfHearts,
    ]);
    expect([...p3.hand].sort(sortHeartsHand)).toStrictEqual([
      twoOfClubs,
      threeOfClubs,
      sevenOfClubs,
      nineOfClubs,
      twoOfSpades,
      aOfSpades,
      threeOfDiamonds,
      fiveOfDiamonds,
      nineOfDiamonds,
      tenOfDiamonds,
      threeOfHearts,
      fourOfHearts,
      sevenOfHearts,
    ]);

    p3.passCards([aOfSpades, tenOfDiamonds, nineOfDiamonds]);
    p2.passCards([jOfSpades, sixOfClubs, fiveOfHearts]);
    p1.passCards([kOfHearts, sixOfHearts, sixOfSpades]);
    p0.passCards([qOfHearts, qOfDiamonds, kOfSpades]);

    expect(game.getPlayerData(p0).round.cardsPassed).toStrictEqual([
      qOfHearts,
      qOfDiamonds,
      kOfSpades,
    ]);
    expect(game.getPlayerData(p1).round.cardsPassed).toStrictEqual([
      kOfHearts,
      sixOfHearts,
      sixOfSpades,
    ]);
    expect(game.getPlayerData(p2).round.cardsPassed).toStrictEqual([
      jOfSpades,
      sixOfClubs,
      fiveOfHearts,
    ]);
    expect(game.getPlayerData(p3).round.cardsPassed).toStrictEqual([
      aOfSpades,
      tenOfDiamonds,
      nineOfDiamonds,
    ]);
    expect(game.getPlayerData(p0).round.cardsReceived).toStrictEqual([
      kOfHearts,
      sixOfHearts,
      sixOfSpades,
    ]);
    expect(game.getPlayerData(p1).round.cardsReceived).toStrictEqual([
      jOfSpades,
      sixOfClubs,
      fiveOfHearts,
    ]);
    expect(game.getPlayerData(p2).round.cardsReceived).toStrictEqual([
      aOfSpades,
      tenOfDiamonds,
      nineOfDiamonds,
    ]);
    expect(game.getPlayerData(p3).round.cardsReceived).toStrictEqual([
      qOfHearts,
      qOfDiamonds,
      kOfSpades,
    ]);

    p3.playCard(twoOfClubs);
    p0.playCard(kOfClubs);
    p1.playCard(aOfClubs);
    p2.playCard(eightOfClubs);

    p1.playCard(jOfClubs);
    p2.playCard(tenOfClubs);
    p3.playCard(nineOfClubs);
    p0.playCard(qOfClubs);

    p0.playCard(tenOfSpades);
    p1.playCard(qOfSpades);
    p2.playCard(aOfSpades);
    p3.playCard(kOfSpades);

    expect(game.gameInfo.players[2].round.points).toBe(13);
    expect(game.gameInfo.round.heartsBroken).toBe(false);

    expect(() => {
      p2.playCard(aOfHearts);
    }).toThrow(/Playing Error: Hearts has not been broken/);

    p2.playCard(aOfDiamonds);
    p3.playCard(qOfDiamonds);
    p0.playCard(eightOfDiamonds);
    p1.playCard(fourOfDiamonds);

    p2.playCard(kOfDiamonds);
    p3.playCard(fiveOfDiamonds);
    p0.playCard(fourOfClubs);
    p1.playCard(twoOfDiamonds);

    p2.playCard(jOfDiamonds);
    p3.playCard(threeOfDiamonds);
    p0.playCard(kOfHearts);
    p1.playCard(sixOfDiamonds);

    expect(game.gameInfo.round.heartsBroken).toBe(true);

    p2.playCard(aOfHearts);
    p3.playCard(qOfHearts);
    p0.playCard(sixOfHearts);
    p1.playCard(jOfHearts);

    p2.playCard(tenOfHearts);
    p3.playCard(sevenOfHearts);
    p0.playCard(eightOfSpades);
    p1.playCard(fiveOfHearts);

    p2.playCard(nineOfHearts);
    p3.playCard(fourOfHearts);
    p0.playCard(sevenOfSpades);
    p1.playCard(twoOfHearts);

    p2.playCard(eightOfHearts);
    p3.playCard(threeOfHearts);
    p0.playCard(sixOfSpades);
    p1.playCard(jOfSpades);

    expect(game.gameInfo.players[2].round.points).toBe(26);

    p2.playCard(tenOfDiamonds);
    p3.playCard(twoOfSpades);
    p0.playCard(fiveOfSpades);
    p1.playCard(nineOfSpades);

    p2.playCard(nineOfDiamonds);
    p3.playCard(sevenOfClubs);
    p0.playCard(fourOfSpades);
    p1.playCard(sixOfClubs);

    p2.playCard(sevenOfDiamonds);
    p3.playCard(threeOfClubs);
    p0.playCard(threeOfSpades);
    p1.playCard(fiveOfClubs);

    expect(game.gameInfo.gamePhase).toBe(HeartsGamePhase.DEAL);

    expect(game.gameInfo.players[0].round.points).toBe(26);
    expect(game.gameInfo.players[1].round.points).toBe(26);
    expect(game.gameInfo.players[2].round.points).toBe(0);
    expect(game.gameInfo.players[3].round.points).toBe(26);

    expect(game.gameInfo.players[0].score.reduce((a, b) => a + b, 0)).toBe(43);
    expect(game.gameInfo.players[1].score.reduce((a, b) => a + b, 0)).toBe(28);
    expect(game.gameInfo.players[2].score.reduce((a, b) => a + b, 0)).toBe(2);
    expect(game.gameInfo.players[3].score.reduce((a, b) => a + b, 0)).toBe(31);
  });
  test('round 3', () => {
    seedrandom('round3', {global: true});
    game.startNewRound();
    expect(game.gameInfo.passDirection).toBe(HeartsPassDirection.ACROSS);
    expect(
      [...p0.hand].sort(sortHeartsHand).map(a => a.description)
    ).toStrictEqual([
      '5 of clubs',
      '6 of clubs',
      '7 of clubs',
      '2 of spades',
      '5 of spades',
      '9 of spades',
      '2 of diamonds',
      '8 of diamonds',
      '9 of diamonds',
      '10 of diamonds',
      'K of diamonds',
      '2 of hearts',
      'K of hearts',
    ]);
    expect(
      [...p1.hand].sort(sortHeartsHand).map(a => a.description)
    ).toStrictEqual([
      '2 of clubs',
      '6 of spades',
      'Q of spades',
      'K of spades',
      '6 of diamonds',
      'Q of diamonds',
      'A of diamonds',
      '4 of hearts',
      '5 of hearts',
      '7 of hearts',
      '9 of hearts',
      'J of hearts',
      'Q of hearts',
    ]);
    expect(
      [...p2.hand].sort(sortHeartsHand).map(a => a.description)
    ).toStrictEqual([
      '4 of clubs',
      '8 of clubs',
      'J of clubs',
      'A of clubs',
      '3 of spades',
      'J of spades',
      '4 of diamonds',
      '5 of diamonds',
      '7 of diamonds',
      'J of diamonds',
      '8 of hearts',
      '10 of hearts',
      'A of hearts',
    ]);
    expect(
      [...p3.hand].sort(sortHeartsHand).map(a => a.description)
    ).toStrictEqual([
      '3 of clubs',
      '9 of clubs',
      '10 of clubs',
      'Q of clubs',
      'K of clubs',
      '4 of spades',
      '7 of spades',
      '8 of spades',
      '10 of spades',
      'A of spades',
      '3 of diamonds',
      '3 of hearts',
      '6 of hearts',
    ]);

    p0.passCards([kOfHearts, sevenOfClubs, sixOfClubs]);
    p2.passCards([aOfHearts, tenOfHearts, eightOfHearts]);
    p1.passCards([sixOfDiamonds, fourOfHearts, sixOfSpades]);
    p3.passCards([aOfSpades, threeOfDiamonds, sixOfHearts]);
    expect(game.getPlayerData(p0).round.cardsReceived).toStrictEqual([
      aOfHearts,
      tenOfHearts,
      eightOfHearts,
    ]);
    expect(game.getPlayerData(p1).round.cardsReceived).toStrictEqual([
      aOfSpades,
      threeOfDiamonds,
      sixOfHearts,
    ]);
    expect(game.getPlayerData(p2).round.cardsReceived).toStrictEqual([
      kOfHearts,
      sevenOfClubs,
      sixOfClubs,
    ]);
    expect(game.getPlayerData(p3).round.cardsReceived).toStrictEqual([
      sixOfDiamonds,
      fourOfHearts,
      sixOfSpades,
    ]);

    p1.playCard(twoOfClubs);
    p2.playCard(aOfClubs);
    p3.playCard(kOfClubs);
    p0.playCard(fiveOfClubs);

    p2.playCard(jOfDiamonds);
    p3.playCard(sixOfDiamonds);
    p0.playCard(twoOfDiamonds);
    p1.playCard(aOfDiamonds);

    p1.playCard(qOfDiamonds);
    p2.playCard(sevenOfDiamonds);
    p3.playCard(fourOfHearts);
    p0.playCard(eightOfDiamonds);

    p1.playCard(threeOfDiamonds);
    p2.playCard(fiveOfDiamonds);
    p3.playCard(threeOfHearts);
    p0.playCard(nineOfDiamonds);

    p0.playCard(kOfDiamonds);
    p1.playCard(qOfSpades);
    p2.playCard(fourOfDiamonds);
    p3.playCard(tenOfSpades);

    p0.playCard(tenOfDiamonds);
    p1.playCard(qOfHearts);
    p2.playCard(kOfHearts);
    p3.playCard(eightOfSpades);

    p0.playCard(aOfHearts);
    p1.playCard(jOfHearts);
    p2.playCard(jOfSpades);
    p3.playCard(sevenOfSpades);

    p0.playCard(tenOfHearts);
    p1.playCard(nineOfHearts);
    p2.playCard(threeOfSpades);
    p3.playCard(sixOfSpades);

    p0.playCard(eightOfHearts);
    p1.playCard(sevenOfHearts);
    p2.playCard(jOfClubs);
    p3.playCard(fourOfSpades);

    p0.playCard(twoOfHearts);
    p1.playCard(sixOfHearts);
    p2.playCard(eightOfClubs);
    p3.playCard(qOfClubs);

    p1.playCard(fiveOfHearts);
    p2.playCard(sevenOfClubs);
    p3.playCard(tenOfClubs);
    p0.playCard(nineOfSpades);

    p1.playCard(aOfSpades);
    p2.playCard(sixOfClubs);
    p3.playCard(nineOfClubs);
    p0.playCard(fiveOfSpades);

    p1.playCard(kOfSpades);
    p2.playCard(fourOfClubs);
    p3.playCard(threeOfClubs);
    p0.playCard(twoOfSpades);

    expect(game.gamePhase).toBe(HeartsGamePhase.DEAL);
    expect(game.getPlayerData(p0).round.points).toBe(22);
    expect(game.getPlayerData(p0).score).toStrictEqual([17, 26, 22]);
    expect(game.getPlayerData(p1).score).toStrictEqual([2, 26, 4]);
    expect(game.getPlayerData(p2).score).toStrictEqual([2, 0, 0]);
    expect(game.getPlayerData(p3).score).toStrictEqual([5, 26, 0]);
  });
  test('keeper round', () => {
    game.startNewRound();
    expect(game.passDirection).toBe(HeartsPassDirection.KEEP);
    expect(game.gamePhase).toBe(HeartsGamePhase.PLAY);

    expect(
      [...p0.hand].sort(sortHeartsHand).map(a => a.description)
    ).toStrictEqual([
      '2 of clubs',
      '5 of clubs',
      '8 of clubs',
      'J of clubs',
      '3 of spades',
      '6 of spades',
      '9 of spades',
      '10 of spades',
      '3 of diamonds',
      '4 of diamonds',
      '10 of diamonds',
      '10 of hearts',
      'K of hearts',
    ]);
    expect(
      [...p1.hand].sort(sortHeartsHand).map(a => a.description)
    ).toStrictEqual([
      '4 of clubs',
      '7 of clubs',
      'Q of clubs',
      '5 of spades',
      'J of spades',
      'Q of spades',
      'K of spades',
      '2 of diamonds',
      '8 of diamonds',
      'J of diamonds',
      'Q of diamonds',
      '6 of hearts',
      '7 of hearts',
    ]);
    expect(
      [...p2.hand].sort(sortHeartsHand).map(a => a.description)
    ).toStrictEqual([
      '3 of clubs',
      '6 of clubs',
      '9 of clubs',
      '10 of clubs',
      'A of clubs',
      '4 of spades',
      'A of spades',
      '5 of diamonds',
      '6 of diamonds',
      'K of diamonds',
      '2 of hearts',
      '9 of hearts',
      'A of hearts',
    ]);
    expect(
      [...p3.hand].sort(sortHeartsHand).map(a => a.description)
    ).toStrictEqual([
      'K of clubs',
      '2 of spades',
      '7 of spades',
      '8 of spades',
      '7 of diamonds',
      '9 of diamonds',
      'A of diamonds',
      '3 of hearts',
      '4 of hearts',
      '5 of hearts',
      '8 of hearts',
      'J of hearts',
      'Q of hearts',
    ]);

    p0.playCard(twoOfClubs);
    p1.playCard(qOfClubs);
    p2.playCard(aOfClubs);
    p3.playCard(kOfClubs);

    p2.playCard(tenOfClubs);
    p3.playCard(qOfHearts);
    p0.playCard(eightOfClubs);
    p1.playCard(sevenOfClubs);

    p2.playCard(nineOfHearts);
    p3.playCard(jOfHearts);
    p0.playCard(kOfHearts);
    p1.playCard(sevenOfHearts);

    p0.playCard(tenOfHearts);
    p1.playCard(sixOfHearts);
    p2.playCard(twoOfHearts);
    p3.playCard(eightOfHearts);

    p0.playCard(fiveOfClubs);
    p1.playCard(fourOfClubs);
    p2.playCard(threeOfClubs);
    p3.playCard(fiveOfHearts);

    p0.playCard(jOfClubs);
    p1.playCard(qOfSpades);
    p2.playCard(sixOfClubs);
    p3.playCard(aOfDiamonds);

    p0.playCard(threeOfSpades);
    p1.playCard(jOfSpades);
    p2.playCard(aOfSpades);
    p3.playCard(eightOfSpades);

    p2.playCard(nineOfClubs);
    p3.playCard(twoOfSpades);
    p0.playCard(sixOfSpades);
    p1.playCard(kOfSpades);

    p2.playCard(fourOfSpades);
    p3.playCard(sevenOfSpades);
    p0.playCard(nineOfSpades);
    p1.playCard(fiveOfSpades);

    p0.playCard(threeOfDiamonds);
    p1.playCard(twoOfDiamonds);
    p2.playCard(fiveOfDiamonds);
    p3.playCard(sevenOfDiamonds);

    p3.playCard(nineOfDiamonds);
    p0.playCard(tenOfDiamonds);
    p1.playCard(qOfDiamonds);
    p2.playCard(kOfDiamonds);

    p2.playCard(aOfHearts);
    p3.playCard(threeOfHearts);
    p0.playCard(fourOfDiamonds);
    p1.playCard(jOfDiamonds);

    p2.playCard(sixOfDiamonds);
    p3.playCard(fourOfHearts);
    p0.playCard(tenOfSpades);
    p1.playCard(eightOfDiamonds);

    expect(game.gameInfo.players[0].round.points).toBe(22);
    expect(game.gameInfo.players[1].round.points).toBe(1);
    expect(game.gameInfo.players[2].round.points).toBe(3);
    expect(game.gameInfo.players[3].round.points).toBe(0);
  });
  test('game ends', () => {
    game.startNewRound();

    expect(
      [...p0.hand].sort(sortHeartsHand).map(a => a.description)
    ).toStrictEqual([
      '3 of clubs',
      '6 of clubs',
      '8 of clubs',
      '5 of spades',
      '7 of spades',
      '8 of spades',
      '5 of diamonds',
      '8 of diamonds',
      '9 of diamonds',
      'Q of diamonds',
      '4 of hearts',
      '8 of hearts',
      '10 of hearts',
    ]);
    expect(
      [...p1.hand].sort(sortHeartsHand).map(a => a.description)
    ).toStrictEqual([
      '4 of clubs',
      '7 of clubs',
      '10 of clubs',
      'J of clubs',
      'Q of clubs',
      '4 of spades',
      '9 of spades',
      'J of spades',
      'A of spades',
      'J of diamonds',
      'A of diamonds',
      'J of hearts',
      'K of hearts',
    ]);
    expect(
      [...p2.hand].sort(sortHeartsHand).map(a => a.description)
    ).toStrictEqual([
      '2 of clubs',
      '9 of clubs',
      '3 of spades',
      '6 of spades',
      '10 of spades',
      'Q of spades',
      '2 of diamonds',
      '4 of diamonds',
      '2 of hearts',
      '3 of hearts',
      '5 of hearts',
      '6 of hearts',
      '7 of hearts',
    ]);
    expect(
      [...p3.hand].sort(sortHeartsHand).map(a => a.description)
    ).toStrictEqual([
      '5 of clubs',
      'K of clubs',
      'A of clubs',
      '2 of spades',
      'K of spades',
      '3 of diamonds',
      '6 of diamonds',
      '7 of diamonds',
      '10 of diamonds',
      'K of diamonds',
      '9 of hearts',
      'Q of hearts',
      'A of hearts',
    ]);

    expect(game.gameInfo.gamePhase).toBe(HeartsGamePhase.PASS);
    expect(game.gameInfo.passDirection).toBe(HeartsPassDirection.LEFT);

    p3.passCards([aOfHearts, aOfClubs, kOfClubs]);
    p0.passCards([fourOfHearts, eightOfHearts, tenOfHearts]);
    p1.passCards([aOfSpades, jOfSpades, nineOfSpades]);
    p2.passCards([twoOfDiamonds, nineOfClubs, fourOfDiamonds]);

    p2.playCard(twoOfClubs);
    p3.playCard(nineOfClubs);
    p0.playCard(threeOfClubs);
    p1.playCard(qOfClubs);

    p1.playCard(jOfClubs);
    p2.playCard(sevenOfHearts);
    p3.playCard(fiveOfClubs);
    p0.playCard(eightOfClubs);

    p1.playCard(tenOfClubs);
    p2.playCard(sixOfHearts);
    p3.playCard(kOfSpades);
    p0.playCard(kOfClubs);

    p0.playCard(aOfHearts);
    p1.playCard(kOfHearts);
    p2.playCard(fiveOfHearts);
    p3.playCard(qOfHearts);

    p0.playCard(aOfClubs);
    p1.playCard(sevenOfClubs);
    p2.playCard(qOfSpades);
    p3.playCard(twoOfSpades);

    p0.playCard(sixOfClubs);
    p1.playCard(fourOfClubs);
    p2.playCard(threeOfSpades);
    p3.playCard(twoOfDiamonds);

    p0.playCard(fiveOfSpades);
    p1.playCard(fourOfSpades);
    p2.playCard(sixOfSpades);
    p3.playCard(threeOfDiamonds);

    p2.playCard(nineOfSpades);
    p3.playCard(fourOfDiamonds);
    p0.playCard(sevenOfSpades);
    p1.playCard(jOfDiamonds);

    p2.playCard(tenOfSpades);
    p3.playCard(sixOfDiamonds);
    p0.playCard(eightOfSpades);
    p1.playCard(aOfDiamonds);

    p2.playCard(jOfSpades);
    p3.playCard(sevenOfDiamonds);
    p0.playCard(fiveOfDiamonds);
    p1.playCard(fourOfHearts);

    p2.playCard(aOfSpades);
    p3.playCard(tenOfDiamonds);
    p0.playCard(eightOfDiamonds);
    p1.playCard(eightOfHearts);

    p2.playCard(twoOfHearts);
    p3.playCard(nineOfHearts);
    p0.playCard(nineOfDiamonds);
    p1.playCard(tenOfHearts);

    p1.playCard(jOfHearts);
    p2.playCard(threeOfHearts);
    p3.playCard(kOfDiamonds);
    p0.playCard(qOfDiamonds);

    expect(game.gameInfo.gameState).toBe(GameState.FINISHED);
    printHands();
  });
});

//function to play a card, then add it to the played cards in playerInfo
function playCard(
  player: HeartsPlayer,
  card: Card,
  playerInfo: HeartsPlayerInfo
) {
  player.playCard(card);
  playerInfo.round.cardsPlayed.push(card);
}

//function to sort cards low->high clubs, spades, diamonds, hearts
function sortHeartsHand(a: Card, b: Card): number {
  const aRank = standardRankValues.get(a.rank);
  const bRank = standardRankValues.get(b.rank);
  if (aRank === undefined || bRank === undefined) {
    return 0;
  }
  if (a.suit === b.suit) {
    return aRank - bRank;
  }
  if (a.suit === hearts) {
    return 1;
  }
  if (b.suit === hearts) {
    return -1;
  }
  if (a.suit === diamonds) {
    return 1;
  }
  if (b.suit === diamonds) {
    return -1;
  }
  if (a.suit === spades) {
    return 1;
  }
  if (b.suit === spades) {
    return -1;
  }
  return 0;
}

function printHands() {
  console.log('----- HANDS ----');
  for (const p in testPlayers) {
    console.log(`${p} :`);
    console.log(
      [...testPlayers[p].hand].sort(sortHeartsHand).map(a => a.description)
    );
  }
}
