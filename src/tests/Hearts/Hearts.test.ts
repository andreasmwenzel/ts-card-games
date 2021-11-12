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

let jules: HeartsPlayer,
  joe: HeartsPlayer,
  jim: HeartsPlayer,
  jess: HeartsPlayer;

let julesInfo: HeartsPlayerInfo,
  joeInfo: HeartsPlayerInfo,
  jimInfo: HeartsPlayerInfo,
  jessInfo: HeartsPlayerInfo;

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

  julesInfo = {
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

  joeInfo = {
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

  jimInfo = {
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

  jessInfo = {
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

  testPlayers = [];
  test('add players', () => {
    joe = game.addPlayer({name: 'joe', id: '1'}, 1);
    testPlayers.push(joe);

    expectedGameInfo.players.push(joeInfo);
    expect(game.gameInfo).toEqual(expectedGameInfo);

    jim = game.addPlayer({name: 'jim', id: '2'}, 2);
    expectedGameInfo.players.push(jimInfo);

    jess = game.addPlayer({name: 'jessica', id: '3'}, 3);

    expectedGameInfo.players.push(jessInfo);

    jules = game.addPlayer({name: 'julie'});
    expectedGameInfo.players.push(julesInfo);
    expectedGameInfo.gameState = GameState.WAITING_FOR_START;
    expect(game.gameInfo).toEqual(expectedGameInfo);

    testPlayers = [jules, joe, jim, jess];
  });

  test('starting the game', () => {
    joe.setReady(true);
    joeInfo.isReady = true;
    jim.setReady(true);
    jimInfo.isReady = true;
    jess.setReady(true);
    jessInfo.isReady = true;
    seedrandom('hearts', {global: true});
    jules.setReady(true);
    julesInfo.isReady = true;
    expectedGameInfo.players = expectedGameInfo.players.sort(
      (a, b) => a.position - b.position
    );
    expectedGameInfo.gameState = GameState.ACTIVE;
    expectedGameInfo.gamePhase = HeartsGamePhase.PASS;
    expectedGameInfo.passDirection = HeartsPassDirection.LEFT;

    expect(game.gameInfo).toEqual(expectedGameInfo);

    expect(jules.handLength).toEqual(13);
    expect(jules.hand.map(a => a.description)).toStrictEqual([
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
    threeOfHearts = jules.hand[0];
    kOfSpades = jules.hand[1];
    sixOfHearts = jules.hand[2];
    sixOfDiamonds = jules.hand[3];
    fiveOfHearts = jules.hand[4];
    fourOfSpades = jules.hand[5];
    sevenOfSpades = jules.hand[6];
    qOfHearts = jules.hand[7];
    aOfDiamonds = jules.hand[8];
    twoOfDiamonds = jules.hand[9];
    tenOfDiamonds = jules.hand[10];
    fourOfDiamonds = jules.hand[11];
    nineOfHearts = jules.hand[12];
    expect(game.getPlayerData(jules).round.cardsDealt).toStrictEqual([
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

    expect(joe.handLength).toEqual(13);
    expect(joe.hand.map(a => a.description)).toStrictEqual([
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
    nineOfClubs = joe.hand[0];
    eightOfSpades = joe.hand[1];
    fiveOfSpades = joe.hand[2];
    qOfDiamonds = joe.hand[3];
    fourOfHearts = joe.hand[4];
    kOfHearts = joe.hand[5];
    sevenOfDiamonds = joe.hand[6];
    fourOfClubs = joe.hand[7];
    jOfClubs = joe.hand[8];
    threeOfClubs = joe.hand[9];
    sixOfClubs = joe.hand[10];
    nineOfDiamonds = joe.hand[11];
    sixOfSpades = joe.hand[12];
    expect(game.getPlayerData(joe).round.cardsDealt).toStrictEqual([
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

    expect(jim.handLength).toEqual(13);
    expect(jim.hand.map(a => a.description)).toStrictEqual([
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
    qOfClubs = jim.hand[0];
    twoOfClubs = jim.hand[1];
    twoOfHearts = jim.hand[2];
    fiveOfClubs = jim.hand[3];
    jOfHearts = jim.hand[4];
    tenOfSpades = jim.hand[5];
    aOfHearts = jim.hand[6];
    sevenOfHearts = jim.hand[7];
    kOfClubs = jim.hand[8];
    tenOfClubs = jim.hand[9];
    threeOfSpades = jim.hand[10];
    threeOfDiamonds = jim.hand[11];
    twoOfSpades = jim.hand[12];
    expect(game.getPlayerData(jim).round.cardsDealt).toStrictEqual([
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

    expect(jess.handLength).toEqual(13);
    expect(jess.hand.map(a => a.description)).toStrictEqual([
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
    aOfClubs = jess.hand[0];
    kOfDiamonds = jess.hand[1];
    qOfSpades = jess.hand[2];
    sevenOfClubs = jess.hand[3];
    eightOfClubs = jess.hand[4];
    tenOfHearts = jess.hand[5];
    jOfSpades = jess.hand[6];
    nineOfSpades = jess.hand[7];
    eightOfDiamonds = jess.hand[8];
    jOfDiamonds = jess.hand[9];
    aOfSpades = jess.hand[10];
    eightOfHearts = jess.hand[11];
    fiveOfDiamonds = jess.hand[12];
    expect(game.getPlayerData(jess).round.cardsDealt).toStrictEqual([
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

    expect(jules.hasSuit(hearts)).toBe(true);
    expect(jules.hasOnlyHearts()).toBe(false);
    expect(jules.hasCard(four, spades)).toBe(true);
    expect(jim.hasCard(four, spades)).toBe(false);
    expect(jules.hasTwoOfClubs()).toBe(false);
    expect(jim.hasTwoOfClubs()).toBe(true);

    expect(game.getPlayerData(jules).round.cardsDealt).toStrictEqual(
      jules.hand
    );
    expect(game.getPlayerData(joe).round.cardsDealt).toStrictEqual(joe.hand);
    expect(game.getPlayerData(jim).round.cardsDealt).toStrictEqual(jim.hand);
    expect(game.getPlayerData(jess).round.cardsDealt).toStrictEqual(jess.hand);
  });

  test('passing cards', () => {
    expect(() => {
      jules.playCard(jules.hand[0]);
    }).toThrow(/Playing Error: Not in the playing phase/);
    expect(() => {
      jules.passCards(jules.hand.slice(0, 4));
    }).toThrow(/Passing Error: Must pass/);

    expect(() => {
      jules.passCards(joe.hand.slice(0, 3));
    }).toThrow(/Passing Error: player does not have that card/);

    const p0Pass = [kOfSpades, qOfHearts, aOfDiamonds];
    jules.passCards(p0Pass);
    expect(game.getPlayerData(jules).round.cardsPassed).toStrictEqual(p0Pass);
    julesInfo.round.hasPassed = true;

    const p1Pass = [qOfDiamonds, kOfHearts, nineOfDiamonds];
    joe.passCards(p1Pass);
    expect(game.getPlayerData(joe).round.cardsPassed).toStrictEqual(p1Pass);
    joeInfo.round.hasPassed = true;

    const p2Pass = [qOfClubs, aOfHearts, kOfClubs];
    jim.passCards(p2Pass);
    expect(game.getPlayerData(jim).round.cardsPassed).toStrictEqual(p2Pass);
    jimInfo.round.hasPassed = true;

    const p3Pass = [kOfDiamonds, tenOfHearts, eightOfHearts];
    jess.passCards(p3Pass);
    expect(game.getPlayerData(jess).round.cardsPassed).toStrictEqual(p3Pass);
    jessInfo.round.hasPassed = true;

    expectedGameInfo.gamePhase = HeartsGamePhase.PLAY;
    expectedGameInfo.round.positionToLead = 2;
    expectedGameInfo.round.positionToPlay = 2;
    expectedGameInfo.round.firstTrick = true;
    expect(game.gameInfo).toEqual(expectedGameInfo);
    expect([...jules.hand].sort(sortHeartsHand)).toStrictEqual([
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
    expect([...joe.hand].sort(sortHeartsHand)).toStrictEqual([
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
    expect([...jim.hand].sort(sortHeartsHand)).toStrictEqual([
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
    expect([...jess.hand].sort(sortHeartsHand)).toStrictEqual([
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

    expect(jules.hasSuit(clubs)).toBe(false);

    expect(game.getPlayerData(jules).round.cardsPassed).toStrictEqual(p0Pass);
    expect(game.getPlayerData(joe).round.cardsPassed).toStrictEqual(p1Pass);
    expect(game.getPlayerData(jim).round.cardsPassed).toStrictEqual(p2Pass);
    expect(game.getPlayerData(jess).round.cardsPassed).toStrictEqual(p3Pass);

    expect(game.getPlayerData(jules).round.cardsReceived).toStrictEqual(p3Pass);
    expect(game.getPlayerData(joe).round.cardsReceived).toStrictEqual(p0Pass);
    expect(game.getPlayerData(jim).round.cardsReceived).toStrictEqual(p1Pass);
    expect(game.getPlayerData(jess).round.cardsReceived).toStrictEqual(p2Pass);
  });
  test('playing a round', () => {
    expect(() => {
      game.startNewRound();
    }).toThrow(/New Round Error: Not in the right Gamephase/);
    expect(() => {
      jules.passCards([]);
    }).toThrow(/Passing Error: Not in the passing phase/);
    expect(() => {
      jules.playCard(jules.hand[0]);
    }).toThrow(/Playing Error: Not this player's turn/);
    expect(() => {
      jim.playCard(jules.hand[0]);
    }).toThrow(/Playing Error: player does not have that card/);

    expect(() => {
      jim.playCard(jim.hand[1]);
    }).toThrow(/Playing Error: first card must be a two of clubs/);

    playCard(jim, twoOfClubs, jimInfo);
    expectedGameInfo.round.positionToPlay = 3;
    expect(game.gameInfo).toEqual(expectedGameInfo);

    expect(() => {
      jess.playCard(qOfSpades);
    }).toThrow(/Playing Error: Must Follow Suit/);
    expect(() => {
      jess.playCard(aOfHearts);
    }).toThrow(/Playing Error: Must Follow Suit/);

    playCard(jess, aOfClubs, jessInfo);
    expectedGameInfo.round.positionToPlay = 0;
    expect(game.gameInfo).toEqual(expectedGameInfo);

    expect(() => {
      jules.playCard(jules.hand[0]);
    }).toThrow(/Playing Error: Cannot play points of first trick/);

    playCard(jules, sevenOfSpades, julesInfo);
    playCard(joe, sixOfClubs, joeInfo);

    jessInfo.round.cardsTaken.push(
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
      jess.playCard(aOfHearts);
    }).toThrow(/Playing Error: Hearts has not been broken/);

    playCard(jess, jOfDiamonds, jessInfo);
    playCard(jules, kOfDiamonds, julesInfo);
    playCard(joe, aOfDiamonds, joeInfo);
    playCard(jim, qOfDiamonds, jimInfo);

    joeInfo.round.cardsTaken.push(
      jOfDiamonds,
      kOfDiamonds,
      aOfDiamonds,
      qOfDiamonds
    );
    expectedGameInfo.round.positionToLead = 1;
    expectedGameInfo.round.positionToPlay = 1;

    expect(game.gameInfo).toStrictEqual(expectedGameInfo);

    playCard(joe, sevenOfDiamonds, joeInfo);
    expectedGameInfo.round.positionToPlay = 2;
    expect(game.gameInfo).toStrictEqual(expectedGameInfo);
    playCard(jim, nineOfDiamonds, jimInfo);
    playCard(jess, eightOfDiamonds, jessInfo);
    playCard(jules, tenOfDiamonds, julesInfo);

    julesInfo.round.cardsTaken.push(
      sevenOfDiamonds,
      nineOfDiamonds,
      eightOfDiamonds,
      tenOfDiamonds
    );

    playCard(jules, fourOfSpades, julesInfo);
    playCard(joe, eightOfSpades, joeInfo);
    playCard(jim, tenOfSpades, jimInfo);
    playCard(jess, aOfSpades, jessInfo);

    jessInfo.round.cardsTaken.push(
      fourOfSpades,
      eightOfSpades,
      tenOfSpades,
      aOfSpades
    );

    expectedGameInfo.round.positionToLead = 3;
    expectedGameInfo.round.positionToPlay = 3;

    expect(game.gameInfo).toStrictEqual(expectedGameInfo);

    expect(jules.hasSuit(clubs)).toBe(false);
    expect(jules.hasSuit(spades)).toBe(false);

    playCard(jess, sevenOfClubs, jessInfo);
    playCard(jules, tenOfHearts, julesInfo);
    playCard(joe, fourOfClubs, joeInfo);
    playCard(jim, fiveOfClubs, jimInfo);

    jessInfo.round.cardsTaken.push(
      sevenOfClubs,
      tenOfHearts,
      fourOfClubs,
      fiveOfClubs
    );
    jessInfo.round.points += 1;

    expectedGameInfo.round.heartsBroken = true;
    expect(game.gameInfo).toStrictEqual(expectedGameInfo);

    playCard(jess, aOfHearts, jessInfo);
    expect(() => {
      jules.playCard(twoOfDiamonds);
    }).toThrow(/Playing Error: Must Follow Suit/);
    playCard(jules, nineOfHearts, julesInfo);
    playCard(joe, qOfHearts, joeInfo);
    playCard(jim, jOfHearts, jimInfo);

    jessInfo.round.cardsTaken.push(
      aOfHearts,
      nineOfHearts,
      qOfHearts,
      jOfHearts
    );
    jessInfo.round.points += 4;

    expect(game.gameInfo).toStrictEqual(expectedGameInfo);
    expect([...jess.hand].sort(sortHeartsHand)).toStrictEqual([
      eightOfClubs,
      qOfClubs,
      kOfClubs,
      nineOfSpades,
      jOfSpades,
      qOfSpades,
      fiveOfDiamonds,
    ]);

    playCard(jess, fiveOfDiamonds, jessInfo);
    playCard(jules, sixOfDiamonds, julesInfo);
    playCard(joe, fourOfHearts, joeInfo);
    expect(() => {
      jim.playCard(kOfHearts);
    }).toThrow(/Playing Error: Must Follow Suit/);
    playCard(jim, threeOfDiamonds, jimInfo);

    julesInfo.round.cardsTaken.push(
      fiveOfDiamonds,
      sixOfDiamonds,
      fourOfHearts,
      threeOfDiamonds
    );
    julesInfo.round.points += 1;

    expectedGameInfo.round.positionToLead = 0;
    expectedGameInfo.round.positionToPlay = 0;

    expect(game.gameInfo).toStrictEqual(expectedGameInfo);

    playCard(jules, twoOfDiamonds, julesInfo);
    playCard(joe, kOfSpades, joeInfo);
    playCard(jim, kOfHearts, jimInfo);
    playCard(jess, qOfSpades, jessInfo);

    julesInfo.round.cardsTaken.push(
      twoOfDiamonds,
      kOfSpades,
      kOfHearts,
      qOfSpades
    );
    julesInfo.round.points += 14;

    expect(game.gameInfo).toStrictEqual(expectedGameInfo);

    playCard(jules, fourOfDiamonds, julesInfo);
    playCard(joe, jOfClubs, joeInfo);
    playCard(jim, tenOfClubs, jimInfo);
    playCard(jess, jOfSpades, jessInfo);

    julesInfo.round.cardsTaken.push(
      fourOfDiamonds,
      jOfClubs,
      tenOfClubs,
      jOfSpades
    );

    expect(jules.hasOnlyHearts()).toBe(true);

    playCard(jules, threeOfHearts, julesInfo);
    playCard(joe, nineOfClubs, joeInfo);
    playCard(jim, twoOfHearts, jimInfo);
    playCard(jess, nineOfSpades, jessInfo);

    julesInfo.round.cardsTaken.push(
      threeOfHearts,
      nineOfClubs,
      twoOfHearts,
      nineOfSpades
    );
    julesInfo.round.points += 2;

    expect(game.gameInfo).toStrictEqual(expectedGameInfo);

    playCard(jules, fiveOfHearts, julesInfo);
    playCard(joe, threeOfClubs, joeInfo);
    playCard(jim, sevenOfHearts, jimInfo);
    playCard(jess, kOfClubs, jessInfo);

    jimInfo.round.cardsTaken.push(
      fiveOfHearts,
      threeOfClubs,
      sevenOfHearts,
      kOfClubs
    );
    jimInfo.round.points += 2;
    expectedGameInfo.round.positionToLead = 2;
    expectedGameInfo.round.positionToPlay = 2;

    expect(game.gameInfo).toStrictEqual(expectedGameInfo);

    playCard(jim, threeOfSpades, jimInfo);
    playCard(jess, qOfClubs, jessInfo);
    playCard(jules, eightOfHearts, julesInfo);
    playCard(joe, sixOfSpades, joeInfo);

    joeInfo.round.cardsTaken.push(
      threeOfSpades,
      qOfClubs,
      eightOfHearts,
      sixOfSpades
    );
    joeInfo.round.points += 1;
    expectedGameInfo.round.positionToLead = 1;
    expectedGameInfo.round.positionToPlay = 1;

    expect(game.gameInfo).toStrictEqual(expectedGameInfo);

    playCard(joe, fiveOfSpades, joeInfo);
    playCard(jim, twoOfSpades, jimInfo);
    playCard(jess, eightOfClubs, jessInfo);
    playCard(jules, sixOfHearts, julesInfo);

    joeInfo.round.cardsTaken.push(
      fiveOfSpades,
      twoOfSpades,
      eightOfClubs,
      sixOfHearts
    );
    joeInfo.round.points += 1;

    expectedGameInfo.round.positionToPlay = 0;
    julesInfo.score = [17];
    joeInfo.score = [2];
    jimInfo.score = [2];
    jessInfo.score = [5];

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

    julesInfo.round = {
      hasPassed: false,
      points: 0,
      cardsTaken: [],
      cardsPlayed: [],
    };
    joeInfo.round = {
      hasPassed: false,
      points: 0,
      cardsTaken: [],
      cardsPlayed: [],
    };
    jimInfo.round = {
      hasPassed: false,
      points: 0,
      cardsTaken: [],
      cardsPlayed: [],
    };
    jessInfo.round = {
      hasPassed: false,
      points: 0,
      cardsTaken: [],
      cardsPlayed: [],
    };

    expect(game.gameInfo).toStrictEqual(expectedGameInfo);
    expect([...jules.hand].sort(sortHeartsHand)).toStrictEqual([
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
    expect([...joe.hand].sort(sortHeartsHand)).toStrictEqual([
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
    expect([...jim.hand].sort(sortHeartsHand)).toStrictEqual([
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
    expect([...jess.hand].sort(sortHeartsHand)).toStrictEqual([
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

    jess.passCards([aOfSpades, tenOfDiamonds, nineOfDiamonds]);
    jim.passCards([jOfSpades, sixOfClubs, fiveOfHearts]);
    joe.passCards([kOfHearts, sixOfHearts, sixOfSpades]);
    jules.passCards([qOfHearts, qOfDiamonds, kOfSpades]);

    expect(game.getPlayerData(jules).round.cardsPassed).toStrictEqual([
      qOfHearts,
      qOfDiamonds,
      kOfSpades,
    ]);
    expect(game.getPlayerData(joe).round.cardsPassed).toStrictEqual([
      kOfHearts,
      sixOfHearts,
      sixOfSpades,
    ]);
    expect(game.getPlayerData(jim).round.cardsPassed).toStrictEqual([
      jOfSpades,
      sixOfClubs,
      fiveOfHearts,
    ]);
    expect(game.getPlayerData(jess).round.cardsPassed).toStrictEqual([
      aOfSpades,
      tenOfDiamonds,
      nineOfDiamonds,
    ]);
    expect(game.getPlayerData(jules).round.cardsReceived).toStrictEqual([
      kOfHearts,
      sixOfHearts,
      sixOfSpades,
    ]);
    expect(game.getPlayerData(joe).round.cardsReceived).toStrictEqual([
      jOfSpades,
      sixOfClubs,
      fiveOfHearts,
    ]);
    expect(game.getPlayerData(jim).round.cardsReceived).toStrictEqual([
      aOfSpades,
      tenOfDiamonds,
      nineOfDiamonds,
    ]);
    expect(game.getPlayerData(jess).round.cardsReceived).toStrictEqual([
      qOfHearts,
      qOfDiamonds,
      kOfSpades,
    ]);

    jess.playCard(twoOfClubs);
    jules.playCard(kOfClubs);
    joe.playCard(aOfClubs);
    jim.playCard(eightOfClubs);

    joe.playCard(jOfClubs);
    jim.playCard(tenOfClubs);
    jess.playCard(nineOfClubs);
    jules.playCard(qOfClubs);

    jules.playCard(tenOfSpades);
    joe.playCard(qOfSpades);
    jim.playCard(aOfSpades);
    jess.playCard(kOfSpades);

    expect(game.gameInfo.players[2].round.points).toBe(13);
    expect(game.gameInfo.round.heartsBroken).toBe(false);

    expect(() => {
      jim.playCard(aOfHearts);
    }).toThrow(/Playing Error: Hearts has not been broken/);

    jim.playCard(aOfDiamonds);
    jess.playCard(qOfDiamonds);
    jules.playCard(eightOfDiamonds);
    joe.playCard(fourOfDiamonds);

    jim.playCard(kOfDiamonds);
    jess.playCard(fiveOfDiamonds);
    jules.playCard(fourOfClubs);
    joe.playCard(twoOfDiamonds);

    jim.playCard(jOfDiamonds);
    jess.playCard(threeOfDiamonds);
    jules.playCard(kOfHearts);
    joe.playCard(sixOfDiamonds);

    expect(game.gameInfo.round.heartsBroken).toBe(true);

    jim.playCard(aOfHearts);
    jess.playCard(qOfHearts);
    jules.playCard(sixOfHearts);
    joe.playCard(jOfHearts);

    jim.playCard(tenOfHearts);
    jess.playCard(sevenOfHearts);
    jules.playCard(eightOfSpades);
    joe.playCard(fiveOfHearts);

    jim.playCard(nineOfHearts);
    jess.playCard(fourOfHearts);
    jules.playCard(sevenOfSpades);
    joe.playCard(twoOfHearts);

    jim.playCard(eightOfHearts);
    jess.playCard(threeOfHearts);
    jules.playCard(sixOfSpades);
    joe.playCard(jOfSpades);

    expect(game.gameInfo.players[2].round.points).toBe(26);

    jim.playCard(tenOfDiamonds);
    jess.playCard(twoOfSpades);
    jules.playCard(fiveOfSpades);
    joe.playCard(nineOfSpades);

    jim.playCard(nineOfDiamonds);
    jess.playCard(sevenOfClubs);
    jules.playCard(fourOfSpades);
    joe.playCard(sixOfClubs);

    jim.playCard(sevenOfDiamonds);
    jess.playCard(threeOfClubs);
    jules.playCard(threeOfSpades);
    joe.playCard(fiveOfClubs);

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
      [...jules.hand].sort(sortHeartsHand).map(a => a.description)
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
      [...joe.hand].sort(sortHeartsHand).map(a => a.description)
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
      [...jim.hand].sort(sortHeartsHand).map(a => a.description)
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
      [...jess.hand].sort(sortHeartsHand).map(a => a.description)
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

    jules.passCards([kOfHearts, sevenOfClubs, sixOfClubs]);
    jim.passCards([aOfHearts, tenOfHearts, eightOfHearts]);
    joe.passCards([sixOfDiamonds, fourOfHearts, sixOfSpades]);
    jess.passCards([aOfSpades, threeOfDiamonds, sixOfHearts]);
    expect(game.getPlayerData(jules).round.cardsReceived).toStrictEqual([
      aOfHearts,
      tenOfHearts,
      eightOfHearts,
    ]);
    expect(game.getPlayerData(joe).round.cardsReceived).toStrictEqual([
      aOfSpades,
      threeOfDiamonds,
      sixOfHearts,
    ]);
    expect(game.getPlayerData(jim).round.cardsReceived).toStrictEqual([
      kOfHearts,
      sevenOfClubs,
      sixOfClubs,
    ]);
    expect(game.getPlayerData(jess).round.cardsReceived).toStrictEqual([
      sixOfDiamonds,
      fourOfHearts,
      sixOfSpades,
    ]);

    joe.playCard(twoOfClubs);
    jim.playCard(aOfClubs);
    jess.playCard(kOfClubs);
    jules.playCard(fiveOfClubs);

    jim.playCard(jOfDiamonds);
    jess.playCard(sixOfDiamonds);
    jules.playCard(twoOfDiamonds);
    joe.playCard(aOfDiamonds);

    joe.playCard(qOfDiamonds);
    jim.playCard(sevenOfDiamonds);
    jess.playCard(fourOfHearts);
    jules.playCard(eightOfDiamonds);

    joe.playCard(threeOfDiamonds);
    jim.playCard(fiveOfDiamonds);
    jess.playCard(threeOfHearts);
    jules.playCard(nineOfDiamonds);

    jules.playCard(kOfDiamonds);
    joe.playCard(qOfSpades);
    jim.playCard(fourOfDiamonds);
    jess.playCard(tenOfSpades);

    jules.playCard(tenOfDiamonds);
    joe.playCard(qOfHearts);
    jim.playCard(kOfHearts);
    jess.playCard(eightOfSpades);

    jules.playCard(aOfHearts);
    joe.playCard(jOfHearts);
    jim.playCard(jOfSpades);
    jess.playCard(sevenOfSpades);

    jules.playCard(tenOfHearts);
    joe.playCard(nineOfHearts);
    jim.playCard(threeOfSpades);
    jess.playCard(sixOfSpades);

    jules.playCard(eightOfHearts);
    joe.playCard(sevenOfHearts);
    jim.playCard(jOfClubs);
    jess.playCard(fourOfSpades);

    jules.playCard(twoOfHearts);
    joe.playCard(sixOfHearts);
    jim.playCard(eightOfClubs);
    jess.playCard(qOfClubs);

    joe.playCard(fiveOfHearts);
    jim.playCard(sevenOfClubs);
    jess.playCard(tenOfClubs);
    jules.playCard(nineOfSpades);

    joe.playCard(aOfSpades);
    jim.playCard(sixOfClubs);
    jess.playCard(nineOfClubs);
    jules.playCard(fiveOfSpades);

    joe.playCard(kOfSpades);
    jim.playCard(fourOfClubs);
    jess.playCard(threeOfClubs);
    jules.playCard(twoOfSpades);

    expect(game.gamePhase).toBe(HeartsGamePhase.DEAL);
    expect(game.getPlayerData(jules).round.points).toBe(22);
    expect(game.getPlayerData(jules).score).toStrictEqual([17, 26, 22]);
    expect(game.getPlayerData(joe).score).toStrictEqual([2, 26, 4]);
    expect(game.getPlayerData(jim).score).toStrictEqual([2, 0, 0]);
    expect(game.getPlayerData(jess).score).toStrictEqual([5, 26, 0]);
  });
  test('keeper round', () => {
    game.startNewRound();
    expect(game.passDirection).toBe(HeartsPassDirection.KEEP);
    expect(game.gamePhase).toBe(HeartsGamePhase.PLAY);

    expect(
      [...jules.hand].sort(sortHeartsHand).map(a => a.description)
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
      [...joe.hand].sort(sortHeartsHand).map(a => a.description)
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
      [...jim.hand].sort(sortHeartsHand).map(a => a.description)
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
      [...jess.hand].sort(sortHeartsHand).map(a => a.description)
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

    jules.playCard(twoOfClubs);
    joe.playCard(qOfClubs);
    jim.playCard(aOfClubs);
    jess.playCard(kOfClubs);

    jim.playCard(tenOfClubs);
    jess.playCard(qOfHearts);
    jules.playCard(eightOfClubs);
    joe.playCard(sevenOfClubs);

    jim.playCard(nineOfHearts);
    jess.playCard(jOfHearts);
    jules.playCard(kOfHearts);
    joe.playCard(sevenOfHearts);

    jules.playCard(tenOfHearts);
    joe.playCard(sixOfHearts);
    jim.playCard(twoOfHearts);
    jess.playCard(eightOfHearts);

    jules.playCard(fiveOfClubs);
    joe.playCard(fourOfClubs);
    jim.playCard(threeOfClubs);
    jess.playCard(fiveOfHearts);

    jules.playCard(jOfClubs);
    joe.playCard(qOfSpades);
    jim.playCard(sixOfClubs);
    jess.playCard(aOfDiamonds);

    jules.playCard(threeOfSpades);
    joe.playCard(jOfSpades);
    jim.playCard(aOfSpades);
    jess.playCard(eightOfSpades);

    jim.playCard(nineOfClubs);
    jess.playCard(twoOfSpades);
    jules.playCard(sixOfSpades);
    joe.playCard(kOfSpades);

    jim.playCard(fourOfSpades);
    jess.playCard(sevenOfSpades);
    jules.playCard(nineOfSpades);
    joe.playCard(fiveOfSpades);

    jules.playCard(threeOfDiamonds);
    joe.playCard(twoOfDiamonds);
    jim.playCard(fiveOfDiamonds);
    jess.playCard(sevenOfDiamonds);

    jess.playCard(nineOfDiamonds);
    jules.playCard(tenOfDiamonds);
    joe.playCard(qOfDiamonds);
    jim.playCard(kOfDiamonds);

    jim.playCard(aOfHearts);
    jess.playCard(threeOfHearts);
    jules.playCard(fourOfDiamonds);
    joe.playCard(jOfDiamonds);

    jim.playCard(sixOfDiamonds);
    jess.playCard(fourOfHearts);
    jules.playCard(tenOfSpades);
    joe.playCard(eightOfDiamonds);

    expect(game.gameInfo.players[0].round.points).toBe(22);
    expect(game.gameInfo.players[1].round.points).toBe(1);
    expect(game.gameInfo.players[2].round.points).toBe(3);
    expect(game.gameInfo.players[3].round.points).toBe(0);
  });
  test('game ends', () => {
    game.startNewRound();

    expect(
      [...jules.hand].sort(sortHeartsHand).map(a => a.description)
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
      [...joe.hand].sort(sortHeartsHand).map(a => a.description)
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
      [...jim.hand].sort(sortHeartsHand).map(a => a.description)
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
      [...jess.hand].sort(sortHeartsHand).map(a => a.description)
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

    jess.passCards([aOfHearts, aOfClubs, kOfClubs]);
    jules.passCards([fourOfHearts, eightOfHearts, tenOfHearts]);
    joe.passCards([aOfSpades, jOfSpades, nineOfSpades]);
    jim.passCards([twoOfDiamonds, nineOfClubs, fourOfDiamonds]);

    jim.playCard(twoOfClubs);
    jess.playCard(nineOfClubs);
    jules.playCard(threeOfClubs);
    joe.playCard(qOfClubs);

    joe.playCard(jOfClubs);
    jim.playCard(sevenOfHearts);
    jess.playCard(fiveOfClubs);
    jules.playCard(eightOfClubs);

    joe.playCard(tenOfClubs);
    jim.playCard(sixOfHearts);
    jess.playCard(kOfSpades);
    jules.playCard(kOfClubs);

    jules.playCard(aOfHearts);
    joe.playCard(kOfHearts);
    jim.playCard(fiveOfHearts);
    jess.playCard(qOfHearts);

    jules.playCard(aOfClubs);
    joe.playCard(sevenOfClubs);
    jim.playCard(qOfSpades);
    jess.playCard(twoOfSpades);

    jules.playCard(sixOfClubs);
    joe.playCard(fourOfClubs);
    jim.playCard(threeOfSpades);
    jess.playCard(twoOfDiamonds);

    jules.playCard(fiveOfSpades);
    joe.playCard(fourOfSpades);
    jim.playCard(sixOfSpades);
    jess.playCard(threeOfDiamonds);

    jim.playCard(nineOfSpades);
    jess.playCard(fourOfDiamonds);
    jules.playCard(sevenOfSpades);
    joe.playCard(jOfDiamonds);

    jim.playCard(tenOfSpades);
    jess.playCard(sixOfDiamonds);
    jules.playCard(eightOfSpades);
    joe.playCard(aOfDiamonds);

    jim.playCard(jOfSpades);
    jess.playCard(sevenOfDiamonds);
    jules.playCard(fiveOfDiamonds);
    joe.playCard(fourOfHearts);

    jim.playCard(aOfSpades);
    jess.playCard(tenOfDiamonds);
    jules.playCard(eightOfDiamonds);
    joe.playCard(eightOfHearts);

    jim.playCard(twoOfHearts);
    jess.playCard(nineOfHearts);
    jules.playCard(nineOfDiamonds);
    joe.playCard(tenOfHearts);

    joe.playCard(jOfHearts);
    jim.playCard(threeOfHearts);
    jess.playCard(kOfDiamonds);
    jules.playCard(qOfDiamonds);

    expect(game.gameInfo.gameState).toBe(GameState.FINISHED);
    // printHands();
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

// function printHands() {
//   console.log('----- HANDS ----');
//   for (const p in testPlayers) {
//     console.log(`${p} :`);
//     console.log(
//       [...testPlayers[p].hand].sort(sortHeartsHand).map(a => a.description)
//     );
//   }
// }
