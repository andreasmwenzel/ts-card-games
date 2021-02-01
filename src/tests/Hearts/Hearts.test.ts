//"use strict";
import { HeartsPlayer } from "../../index"
import { Hearts } from "../../index";
import {GameState} from "../../CardGame"
import { Player } from "../../Player";

describe("Setting Up a game", ()=>{
  const game = new Hearts("Hearts1");
  test("start new game", () => {
    expect(game).toHaveProperty("id", "Hearts1");
    expect(game.rules.players).toEqual(4);
    expect(game.rules.queenBreaksHearts).toEqual(false);
    expect(game.gameState).toEqual(GameState.WAITING_FOR_PLAYERS)
  });

  const p1 = new HeartsPlayer("joe", "1");
  const p2 = new HeartsPlayer("jim", "2");
  const p3 = new HeartsPlayer("jessica", "3");
  const p4 = new HeartsPlayer("julie", "4")

  test("joining and leaving game", ()=>{
    
    p1.joinGame(game,1);
    expect(game.players).toHaveLength(1);
    expect(game.players).toContain(p1);
    expect(p1.position).toEqual(1);
    // expect(game.players[0]).toEqual(p1.name);

    p2.joinGame(game,2);
    expect(game.players).toHaveLength(2);
    expect(game.players).toContain(p2);
    expect(p2.position).toEqual(2);
    // expect(game.players[0]).toEqual(p1.name);
    // expect(game.players[1]).toEqual(p2.name);

    p3.joinGame(game);
    expect(game.players).toHaveLength(3);
    expect(game.players).toContain(p3);
    expect(p3.position).toEqual(0);

  })

  test("joining errors", ()=>{
    expect(()=>{
      p4.joinGame(game, 0)
    }).toThrowError(/already at position/);
    expect(()=>{
      p4.joinGame(game, 4)
    }).toThrowError(/Join Error: Table on has positions/);

    
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
    expect(game.gameState).toBe(GameState.WAITING_FOR_PLAYERS);
    expect(p4.game).toBe(undefined);
    
  })

  test("players ready", ()=>{

  })

  test("game starts", ()=>{

  })

})