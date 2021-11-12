//"use strict";
import {Deck} from 'ts-cards';
import {validate} from 'uuid';
import {
  Hearts,
  HeartsGameData,
  HeartsGamePhase,
  HeartsPassDirection,
  HeartsPlayer,
} from '..';
import {GameState} from '../types';

const game = new Hearts({name: 'Hearts1'});
let joe: HeartsPlayer;
let jim: HeartsPlayer;
let jess: HeartsPlayer;
let jules: HeartsPlayer;
const dummyPlayer = new HeartsPlayer({name: 'dummy'}, game);

describe('Game Setup', () => {
  test('game info', () => {
    expect(game).toHaveProperty('name', 'Hearts1');
    expect(game.maxPlayers).toEqual(4);
    expect(game.gameState).toEqual(GameState.WAITING_FOR_PLAYERS);
    expect(game.playersInfo).toEqual([]);
    expect(validate(game.id)).toBe(true);
  });

  test('player functions', () => {
    expect(() => {
      game.playerHand(dummyPlayer);
    }).toThrow(/Find Player Error/);
    expect(() => {
      game.isPlayerReady(dummyPlayer);
    }).toThrow(/Find Player Error/);
  });
});

describe('Before game fills up', () => {
  test('Add players to open seat', () => {
    joe = game.addPlayer({name: 'jim'}, 1);

    expect(game.playerHand(joe)).toEqual([]);
    expect(game.isPlayerReady(joe)).toEqual(false);

    jim = game.addPlayer({name: 'jim'}, 2);
    expect(game.playersInfo).toHaveLength(2);
  });

  test('Add player to first available seat', () => {
    jess = game.addPlayer({name: 'jess'});
    expect(jess.position).toEqual(0);
  });

  test('add players to occupied seat', () => {
    expect(() => {
      game.addPlayer({name: 'fails'}, 0);
    }).toThrowError(/Join Error:/);
  });

  test('add player to invalid seat', () => {
    expect(() => {
      game.addPlayer({name: 'fails'}, 4);
    }).toThrowError(/Join Error: Table has integer positions/);
    expect(() => {
      game.addPlayer({name: 'fails'}, -3);
    }).toThrowError(/Join Error: Table has integer positions/);
    expect(() => {
      game.addPlayer({name: 'fails'}, 1.4);
    }).toThrowError(/Join Error: Table has integer positions/);
  });

  test('players ready', () => {
    expect(game.isPlayerReady(joe)).toBe(false);
    game.playerReady(joe, true);
    expect(game.isPlayerReady(joe)).toBe(true);

    game.playerReady(jim, true);
    game.playerReady(jess, true);
    expect(game.gameState).toEqual(GameState.WAITING_FOR_PLAYERS);
  });

  test('player no longer ready', () => {
    game.playerReady(joe, false);
    expect(game.isPlayerReady(joe)).toBe(false);
    expect(game.gameState).toEqual(GameState.WAITING_FOR_PLAYERS);
  });

  test('remove players', () => {
    game.removePlayer(joe);
    expect(game.playersInfo.length).toBe(2);
    expect(joe.gameId).toBe(undefined);
    expect(joe.hand).toStrictEqual([]);
  });

  test('game fills up', () => {
    joe = game.addPlayer({name: 'joe'});
    jules = game.addPlayer({name: 'jules'});
    expect(game.gameState).toBe(GameState.WAITING_FOR_START);

    expect(game.playerPosition(jim)).toBe(2);
    expect(game.playerPosition(jess)).toBe(0);
    expect(game.playerPosition(joe)).toBe(1);
    expect(game.playerPosition(jules)).toBe(3);
  });
});
describe('Game is full but not started', () => {
  test('game info', () => {
    expect(game).toHaveProperty('name', 'Hearts1');
    expect(game.maxPlayers).toEqual(4);
    expect(game.gameState).toEqual(GameState.WAITING_FOR_START);
  });
  test('player functions', () => {
    expect(game.playerHand(jim)).toEqual([]);
  });
  test('add player', () => {
    expect(() => {
      game.addPlayer({name: 'fails'});
    }).toThrow(/Join Error: Game is full/);
    expect(() => {
      game.addPlayer({name: 'fails'}, 0);
    }).toThrow(/Join Error: Game is full/);
  });

  test('remove player', () => {
    game.removePlayer(jim);
    expect(game.gameState).toEqual(GameState.WAITING_FOR_PLAYERS);
  });

  test('game starts', () => {
    jim = game.addPlayer({name: 'jim'});
    expect(game.gameState).toEqual(GameState.WAITING_FOR_START);

    game.playerReady(jim, true);
    game.playerReady(jules, true);
    game.playerReady(joe, true);

    expect(game.gameState).toEqual(GameState.ACTIVE);
  });
});
describe('Active game', () => {
  test('game info', () => {
    expect(game).toHaveProperty('name', 'Hearts1');
    expect(game.maxPlayers).toEqual(4);
    expect(game.gameState).toEqual(GameState.ACTIVE);
  });

  test('add player', () => {
    expect(() => {
      game.addPlayer({name: 'fails'});
    }).toThrow(/Game is full/);
  });

  test('player functions', () => {
    expect(game.isPlayerReady(jim)).toEqual(true);
  });

  test('player leaves', () => {
    game.playerLeave(jess);
    expect(game.gameState).toEqual(GameState.WAITING_FOR_RESTART);
    expect(jess.ready).toBe(false);
  });
});

describe('when a player has left', () => {
  test('game info', () => {
    expect(game).toHaveProperty('name', 'Hearts1');
    expect(game.maxPlayers).toEqual(4);
    expect(game.gameState).toEqual(GameState.WAITING_FOR_RESTART);
  });

  test('player who left readies', () => {
    game.playerReady(jess, true);
    expect(jess.ready).toBe(false);
  });

  test('another player leaves', () => {
    game.playerLeave(jim);
    expect(jim.ready).toBe(false);
  });

  test('players rejoins', () => {
    expect(game.gameState).toEqual(GameState.WAITING_FOR_RESTART);
    game.playerRejoin(jess);
    game.playerRejoin(jim);
    game.playerReady(jim, true);
    game.playerReady(jess, true);
    expect(game.gameState).toEqual(GameState.ACTIVE);

    game.playerReady(jim, false);
    expect(jim.ready).toBe(true);

    console.log(game.gameInfo);
  });
});

describe('remove player', () => {
  test('all players leave', () => {
    game.removePlayer(joe);
    expect(game.gameState).toEqual(GameState.FINISHED);
  });
});

describe('game from data', () => {
  const data: HeartsGameData = {
    players: [],
    id: '1',
    name: 'game',
    rules: {
      queenBreaksHearts: true,
      passingCount: 3,
      playTo: 100,
      players: 1,
    },
    gameState: GameState.WAITING_FOR_PLAYERS,
    gamePhase: HeartsGamePhase.DEAL,
    deck: new Deck(),
    dealer: 0,
    passDirection: HeartsPassDirection.LEFT,
    round: {
      positionToLead: 0,
      positionToPlay: 0,
      firstTrick: true,
      heartsBroken: false,
    },
  };
  const game = new Hearts({data: data});
  expect(game.id).toBe(data.id);
});
