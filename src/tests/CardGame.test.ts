//"use strict";
import { HeartsPlayer } from "../index"
import { Hearts } from "../index";
import {GameState} from "../CardGame"
import { defaultRankValue } from "../cards"

describe("Setting Up a game", ()=>{
  const game = new Hearts("Hearts1");
  test("start new game", () => {
    expect(game).toHaveProperty("id", "Hearts1");
    expect(game.maxPlayers).toEqual(4);
    expect(game.gameState).toEqual(GameState.WAITING_FOR_PLAYERS)
    expect(game.rankValues).toEqual(defaultRankValue)
    expect(game.players).toEqual([])
  });

  
})
describe("Joining and leaving a game", ()=>{
  const game = new Hearts("Hearts1");
  const p1 = new HeartsPlayer("joe", "1");
  const p2 = new HeartsPlayer("jim", "2");
  const p3 = new HeartsPlayer("jessica", "3");
  const p4 = new HeartsPlayer("julie", "4")

  test("Add player", ()=>{
    game.addPlayer(p1,1);
    expect(game.players).toHaveLength(1);
    expect(game.isPlayerReady(p1)).toStrictEqual(false);
    expect(game.playerHand(p1)).toEqual([]);
    expect(game.playerPosition(p1)).toEqual(1);

    game.addPlayer(p2,2);
    expect(game.players).toHaveLength(2);

    game.addPlayer(p3);
    expect(game.players).toHaveLength(3);
  })

  test("joining errors", ()=>{
    expect(()=>{
      game.addPlayer(p4, 0)
    }).toThrowError(/already at position/);
    expect(()=>{
      game.isPlayerReady(p4)
    }).toThrow(/Find Player Error: player/);
    expect(()=>{
      game.addPlayer(p4, 4)
    }).toThrowError(/Join Error: Table has integer positions/);
    expect(()=>{
      game.addPlayer(p4, -3)
    }).toThrowError(/Join Error: Table has integer positions/);
    expect(()=>{
      game.addPlayer(p4, 1.4)
    }).toThrowError(/Join Error: Table has integer positions/);
  })
  

  test("move positions",()=>{
    //with a player not in a game
    expect(()=>{
      game.movePosition(p4,1)
    }).toThrowError(/is not in game/)
    
    //to an occupied seat
    expect(()=>{
      game.movePosition(p3, 1)
    }).toThrow(/is already at position /)
    //to the open seat
    game.movePosition(p3, 3);
    expect(game.playerPosition(p3)).toEqual(3);
  
    //to an occupied seat, switching seats
    game.movePosition(p3, 1, true);
    expect(game.playerPosition(p3)).toEqual(1);
    expect(game.playerPosition(p1)).toEqual(3);
  })
  
  test("game fills up", ()=>{
    game.addPlayer(p4);

    expect(game.playerPosition(p4)).toEqual(0)
    expect(game.gameState).toBe(GameState.WAITING_FOR_START);

    expect(()=>{
      let p5 = new HeartsPlayer("june", "5");
      game.addPlayer(p5);
    }).toThrow(/Join Error: Game is full/)
  })
/*
  test("players leave", ()=>{
    p4.leaveGame();
    expect(game.gameState).toBe(GameState.WAITING_FOR_PLAYERS);
    expect(p4.game).toBe(undefined);
    
  })

  test("players ready", ()=>{

  })

  test("game starts", ()=>{

  })
  
  */

})