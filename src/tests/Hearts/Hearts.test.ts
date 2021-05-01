//"use strict";
import {
  HeartsPlayer,
  Hearts,
  HeartsGamePhase,
  HeartsPassDirection,
  GameState,
} from '../../index';
// import { Hearts, HeartsGamePhase, HeartsPassDirection } from "../../index";
// import { GameState } from "../../CardGame";

describe('Setting Up a game', () => {
  const game = new Hearts('Hearts1');
  test('start new game', () => {
    expect(game).toHaveProperty('id', 'Hearts1');
    expect(game.rules.players).toEqual(4);
    expect(game.rules.queenBreaksHearts).toEqual(false);
    expect(game.gameState).toEqual(GameState.WAITING_FOR_PLAYERS);
  });

  const p1 = new HeartsPlayer('joe', '1');
  const p2 = new HeartsPlayer('jim', '2');
  const p3 = new HeartsPlayer('jessica', '3');
  const p4 = new HeartsPlayer('julie', '4');

  test('joining', () => {
    p1.joinGame(game, 1);
    p2.joinGame(game, 2);
    p3.joinGame(game);
    p4.joinGame(game);

    expect(game.gameInfo).toStrictEqual([
      GameState.WAITING_FOR_START,
      HeartsGamePhase.DEAL,
      HeartsPassDirection.KEEP,
    ]);
  });
  test('players ready', () => {
    p1.ready = true;
    p2.ready = true;
    p3.ready = true;
    p4.ready = true;

    expect(game.gameInfo).toStrictEqual([
      GameState.ACTIVE,
      HeartsGamePhase.PASS,
      HeartsPassDirection.LEFT,
    ]);
  });
});
