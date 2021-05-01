//"use strict";
import {HeartsPlayer, Hearts, GameState, PlayerInfo} from '../index';

let game: Hearts;
const p0 = new HeartsPlayer('joe', '0');
const p1 = new HeartsPlayer('jim', '1');
const p2 = new HeartsPlayer('jessica', '2');
const p3 = new HeartsPlayer('julie', '3');

const p0Info: PlayerInfo = {
  name: p0.name,
  id: p0.id,
  position: -1,
  isReady: false,
  leftTable: false,
};
const p1Info: PlayerInfo = {
  name: p1.name,
  id: p1.id,
  position: -1,
  isReady: false,
  leftTable: false,
};
const p2Info: PlayerInfo = {
  name: p2.name,
  id: p2.id,
  position: -1,
  isReady: false,
  leftTable: false,
};
const p3Info: PlayerInfo = {
  name: p3.name,
  id: p3.id,
  position: -1,
  isReady: false,
  leftTable: false,
};

const playersInfo: PlayerInfo[] = [p0Info, p1Info, p2Info, p3Info]; //track info by player number
let expectedPlayers: PlayerInfo[] = []; //track info by what table should expect

describe('Game Setup', () => {
  game = new Hearts('Hearts1');
  test('game info', () => {
    expect(game).toHaveProperty('id', 'Hearts1');
    expect(game.maxPlayers).toEqual(4);
    expect(game.gameState).toEqual(GameState.WAITING_FOR_PLAYERS);
    expect(game.players).toEqual([]);
  });

  test('player functions', () => {
    expect(() => {
      game.playerHand(p1);
    }).toThrow(/Find Player Error/);
    expect(() => {
      game.isPlayerReady(p1);
    }).toThrow(/Find Player Error/);
  });
});

describe('Before game fills up', () => {
  test('Add players to open seat', () => {
    game.addPlayer(p0, 1);
    p0Info.position = 1;
    expectedPlayers.push(p0Info);

    expect(game.players).toEqual(expectedPlayers);
    expect(game.playerHand(p0)).toEqual([]);
    expect(game.isPlayerReady(p0)).toEqual(false);

    game.addPlayer(p1, 2);
    p1Info.position = 2;
    expectedPlayers.push(p1Info);
    expect(game.players).toEqual(expectedPlayers);
  });

  test('Add player to first available seat', () => {
    const x = game.addPlayer(p2);
    expect(x).toEqual(0);

    p2Info.position = 0; //position 0 should be the first available seat
    expectedPlayers.push(p2Info);
    expect(game.players).toEqual(expectedPlayers);
  });

  test('add player to the game twice', () => {
    expect(() => {
      game.addPlayer(p1);
    }).toThrow(/is already in this game/);
  });

  test('add players to occupied seat', () => {
    expect(() => {
      game.addPlayer(p3, 0);
    }).toThrowError(/already at position/);
    expect(() => {
      game.isPlayerReady(p3);
    }).toThrow(/Find Player Error: player/);
  });

  test('add player to invalid seat', () => {
    expect(() => {
      game.addPlayer(p3, 4);
    }).toThrowError(/Join Error: Table has integer positions/);
    expect(() => {
      game.addPlayer(p3, -3);
    }).toThrowError(/Join Error: Table has integer positions/);
    expect(() => {
      game.addPlayer(p3, 1.4);
    }).toThrowError(/Join Error: Table has integer positions/);
  });

  test('move position errors', () => {
    expect(() => {
      game.movePosition(p3, 1);
    }).toThrowError(/is not in game/);
    //to an occupied seat
    expect(() => {
      game.movePosition(p2, 1);
    }).toThrow(/is already at position /);
    expect(() => {
      game.movePosition(p2, -3);
    }).toThrow(/Table has integer positions/);
  });

  test('move to open seat', () => {
    game.movePosition(p2, p2Info.position);
    expect(game.players).toEqual(expectedPlayers);

    game.movePosition(p2, 3);
    p2Info.position = 3;
    expect(game.players).toEqual(expectedPlayers);
    expect(game.playerPosition(p2)).toEqual(3);

    //test nobody in the seat we're trading to - should run same as above
    game.movePosition(p2, 0, true);
    p2Info.position = 0;
    expect(game.players).toEqual(expectedPlayers);
  });

  test('switching seats', () => {
    game.movePosition(p2, 1, true); // player at position 1 -> p2s position, p2->position 1
    p0Info.position = playersInfo[2].position; //p0 is at position 1
    p2Info.position = 1;
    expect(game.players).toEqual(expectedPlayers);
    expect(game.playerPosition(p2)).toEqual(1);
    expect(game.playerPosition(p0)).toEqual(0);
  });

  test('players ready', () => {
    expect(game.isPlayerReady(p0)).toBe(false);

    game.playerReady(p0, true);
    p0Info.isReady = true;
    expect(game.gameState).toEqual(GameState.WAITING_FOR_PLAYERS);
    expect(game.players).toEqual(expectedPlayers);

    game.playerReady(p1, true);
    p1Info.isReady = true;
    expect(game.gameState).toEqual(GameState.WAITING_FOR_PLAYERS);

    game.playerReady(p2, true);
    p2Info.isReady = true;
    expect(game.gameState).toEqual(GameState.WAITING_FOR_PLAYERS);
  });

  test('player no longer ready', () => {
    game.playerReady(p0, false);
    p0Info.isReady = false;
    expect(game.gameState).toEqual(GameState.WAITING_FOR_PLAYERS);
    expect(game.players).toEqual(expectedPlayers);
  });

  test('remove players', () => {
    game.removePlayer(p0);
    expectedPlayers = expectedPlayers.filter(p => p.id !== p0.id);
    p0Info.isReady = false;

    expect(game.players).toEqual(expectedPlayers);
  });

  test('game fills up', () => {
    game.addPlayer(p0, p0Info.position);
    expectedPlayers.push(p0Info);

    p3Info.position = game.addPlayer(p3);
    expectedPlayers.push(p3Info);

    expect(game.players).toEqual(expectedPlayers);
    expect(game.gameState).toBe(GameState.WAITING_FOR_START);

    expect(game.playerPosition(p1)).toBe(2);
    expect(game.playerPosition(p2)).toBe(1);
    expect(game.playerPosition(p0)).toBe(0);
    expect(game.playerPosition(p3)).toBe(3);
  });
});
describe('Game is full but not started', () => {
  test('game info', () => {
    expect(game).toHaveProperty('id', 'Hearts1');
    expect(game.maxPlayers).toEqual(4);
    expect(game.gameState).toEqual(GameState.WAITING_FOR_START);
  });
  test('player functions', () => {
    expect(game.isPlayerReady(p1)).toEqual(p1Info.isReady);
    expect(game.playerHand(p1)).toEqual([]);
  });
  test('add player', () => {
    const p5 = new HeartsPlayer('june', '5');
    expect(() => {
      game.addPlayer(p5);
    }).toThrow(/Join Error: Game is full/);
    expect(() => {
      game.addPlayer(p5, 0);
    }).toThrow(/Join Error: Game is full/);
  });

  test('move positions', () => {
    // to an occupied seat
    expect(() => {
      game.movePosition(p2, 0);
    }).toThrow(/is already at position /);

    //to invalid seat
    expect(() => {
      game.movePosition(p2, -1);
    }).toThrow(/Table has integer positions/);

    //switching positions
    game.movePosition(p3, 0, true);
    p0Info.position = p3Info.position;
    p3Info.position = 0;
    expect(game.players).toEqual(expectedPlayers);

    //to own seat
    game.movePosition(p2, 1);
    expect(game.players).toEqual(expectedPlayers);

    //to own seat while "switching"
    game.movePosition(p2, 1, true);
    expect(game.players).toEqual(expectedPlayers);
  });

  test('players ready', () => {
    game.playerReady(p0, false);
    p0Info.isReady = false;

    game.playerReady(p1, true);
    p1Info.isReady = true;

    game.playerReady(p2, true);
    p2Info.isReady = true;

    game.playerReady(p3, true);
    p3Info.isReady = true;

    expect(game.players).toEqual(expectedPlayers);
  });

  test('remove player', () => {
    game.removePlayer(p1);
    expectedPlayers = expectedPlayers.filter(pl => pl.id !== p1.id);

    p1Info.isReady = false;

    expect(game.players).toEqual(expectedPlayers);
    expect(game.gameState).toEqual(GameState.WAITING_FOR_PLAYERS);
  });

  test('game starts', () => {
    game.addPlayer(p1);
    expectedPlayers.push(p1Info);

    expect(game.gameState).toEqual(GameState.WAITING_FOR_START);

    game.playerReady(p1, true);
    p1Info.isReady = true;

    expect(game.players).toEqual(expectedPlayers);

    game.playerReady(p0, true);

    //player ready flag is reset
    p0Info.isReady = false;
    p1Info.isReady = false;
    p2Info.isReady = false;
    p3Info.isReady = false;

    //players get sorted by position
    expectedPlayers.sort((a, b) => a.position - b.position);

    expect(game.players).toEqual(expectedPlayers);
    expect(game.gameState).toEqual(GameState.ACTIVE);

    expect(game.playerPosition(p3)).toEqual(0);
    expect(game.playerPosition(p2)).toEqual(1);
    expect(game.playerPosition(p1)).toEqual(2);
    expect(game.playerPosition(p0)).toEqual(3);
  });
});
describe('Active game', () => {
  test('game info', () => {
    expect(game).toHaveProperty('id', 'Hearts1');
    expect(game.maxPlayers).toEqual(4);
    expect(game.gameState).toEqual(GameState.ACTIVE);
  });

  test('add player', () => {
    expect(() => {
      const p5 = new HeartsPlayer('june', '5');
      game.addPlayer(p5);
    }).toThrow(/Game is full/);
  });

  test('move positions', () => {
    expect(() => {
      game.movePosition(p1, 1);
    }).toThrow(/Game has started/);
  });

  test('player functions', () => {
    expect(game.isPlayerReady(p1)).toEqual(p1Info.isReady);
  });

  test('player ready while active', () => {
    expect(() => {
      game.playerReady(p1, true);
    }).toThrow(/Game is active/);
  });

  test('player leaves', () => {
    game.removePlayer(p2);
    p2Info.leftTable = true;
    expect(game.gameState).toEqual(GameState.PLAYER_MISSING);
    expect(game.players).toEqual(expectedPlayers);
  });
});

describe('when a player has left', () => {
  test('game info', () => {
    expect(game).toHaveProperty('id', 'Hearts1');
    expect(game.maxPlayers).toEqual(4);
    expect(game.gameState).toEqual(GameState.PLAYER_MISSING);
  });

  test('a player not at table tries to join', () => {
    expect(() => {
      const p5 = new HeartsPlayer('june', '5');
      game.addPlayer(p5);
    }).toThrow(/Game is full/);
  });

  test('move positions', () => {
    expect(() => {
      game.movePosition(p1, 1);
    }).toThrow(/Game has started/);
  });

  test('players ready', () => {
    game.playerReady(p1, true);
    p1Info.isReady = true;
    game.playerReady(p3, true);
    p3Info.isReady = true;

    expect(game.players).toEqual(expectedPlayers);
  });

  test('player who left readies', () => {
    expect(() => {
      game.playerReady(p2, true);
    }).toThrow(/Player has left the table/);
  });

  test('player functions', () => {
    expect(game.isPlayerReady(p1)).toEqual(p1Info.isReady);
  });

  test('another player leaves', () => {
    game.removePlayer(p1);
    p1Info.leftTable = true;
    p1Info.isReady = false;
    expect(game.players).toEqual(expectedPlayers);
  });

  test('players rejoins', () => {
    game.addPlayer(p1);
    p1Info.leftTable = false;
    game.addPlayer(p2);
    p2Info.leftTable = false;
    expect(game.players).toEqual(expectedPlayers);
    expect(game.gameState).toEqual(GameState.WAITING_FOR_RESTART);
  });
});

describe('after players rejoin', () => {
  test('game info', () => {
    expect(game).toHaveProperty('id', 'Hearts1');
    expect(game.maxPlayers).toEqual(4);
    expect(game.gameState).toEqual(GameState.WAITING_FOR_RESTART);
  });

  test('add player', () => {
    const p5 = new HeartsPlayer('june', '5');
    expect(() => {
      game.addPlayer(p5);
    }).toThrow(/Join Error: Game is full/);
  });

  test('all players ready again', () => {
    game.playerReady(p0, true);
    p0Info.isReady = true;
    game.playerReady(p1, true);
    p1Info.isReady = true;
    game.playerReady(p2, true);
    p2Info.isReady = true;

    expect(game.gameState).toEqual(GameState.ACTIVE);
  });
});

describe('all players leave', () => {
  test('all players leave', () => {
    game.removePlayer(p0);
    game.removePlayer(p1);
    game.removePlayer(p2);
    game.removePlayer(p3);
    expect(game.gameState).toEqual(GameState.FINISHED);
  });
  test('player joing in finished game', () => {
    expect(() => {
      game.addPlayer(p1);
    }).toThrow(/Game has finished/);
  });
  test('player ready in finished game', () => {
    expect(() => {
      game.playerReady(p1, true);
    }).toThrow(/Game has finished/);
  });
});
