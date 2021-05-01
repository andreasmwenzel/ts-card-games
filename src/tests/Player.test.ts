//"use strict";
import {HeartsPlayer} from '../index';
import {Hearts} from '../index';

describe('Setting Up a game', () => {
  const game = new Hearts('Hearts1');

  const p1 = new HeartsPlayer('joe', '1');
  test('constructing a player', () => {
    expect(p1.name).toEqual('joe');
    expect(p1.id).toEqual('1');
    expect(p1.game).toBe('no game');
    expect(p1.position).toBe(undefined);
    expect(p1.ready).toEqual(false);
    expect(p1.hand).toEqual([]);
  });
  /*
  const p2 = new HeartsPlayer("jim", "2");
  const p3 = new HeartsPlayer("jessica", "3");
  const p4 = new HeartsPlayer("julie", "4")

  test("joining and leaving game", ()=>{

    p1.joinGame(game,1);
    // expect(game.players[0]).toEqual(p1.name);

    p2.joinGame(game,2);
    expect(p2.position).toEqual(2);
    // expect(game.players[0]).toEqual(p1.name);
    // expect(game.players[1]).toEqual(p2.name);

    p3.joinGame(game);
    expect(p3.position).toEqual(0);

  })

  test("joining errors", ()=>{
    expect(()=>{
      p4.joinGame(game, 0)
    }).toThrowError(/already at position/);
    expect(()=>{
      p4.joinGame(game, 4)
    }).toThrowError(/Join Error: Table has integer positions/);
  })

  test("switching seats",()=>{
    //with a player not in a game
    expect(()=>{
      p4.movePosition(1)
    }).toThrowError(/is not assigned to a game/);
    expect(()=>{
      game.movePosition(p4,1)
    }).toThrowError(/is not in game/)

    //to an occupied seat
    expect(()=>{
      p3.movePosition(1)
    }).toThrow(/is already at position /)

    //to the open seat
    p3.movePosition(3);
    expect(p3.position).toEqual(3);

    //to an occupied seat, switching seats
    p3.movePosition(1, true);
    expect(p3.position).toEqual(1);
    expect(p1.position).toEqual(3);
  })

  test("game fills up", ()=>{
    p4.joinGame(game)
    expect(p4.position).toEqual(0)
    expect(game.gameState).toBe(GameState.WAITING_FOR_START);

    //sorts on game filling up
    expect(()=>{
      const p5 = new HeartsPlayer("jeff", "4");
      p5.joinGame(game);
    }).toThrow(/Join Error: Game is full/)
  })

  test("players leave", ()=>{
    p4.leaveGame();
  })

  test("players ready", ()=>{

  })

  test("game starts", ()=>{

  })
*/
});
