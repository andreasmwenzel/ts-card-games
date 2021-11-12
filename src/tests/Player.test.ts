//"use strict";
import {validate} from 'uuid';
import {Hearts, HeartsPlayer} from '..';

describe('Player Constructor', () => {
  //const game = new Hearts('Hearts1');
  const game = new Hearts({name: 'hearts'});
  test('with id', () => {
    const player = new HeartsPlayer({name: 'joe', id: '1'}, game);
    expect(player.name).toEqual('joe');
    expect(player.id).toEqual('1');
    expect(() => {
      player.position;
    }).toThrow();
  });

  test('without id', () => {
    const player = new HeartsPlayer({name: 'joe'}, game);
    expect(player.name).toEqual('joe');
    expect(validate(player.id)).toEqual(true);
  });
});

describe('Player and Game interactions', () => {
  const game = new Hearts({name: 'Hearts'});
  let player: HeartsPlayer;
  test('Add to Game', () => {
    player = game.addPlayer({name: 'joe'});
    expect(player.gameId).toBe(game.id);
    expect(player.position).toBe(0);
  });

  test('player ready', () => {
    player.setReady();
    expect(player.ready).toEqual(true);
    player.setReady(false);
    expect(player.ready).toEqual(false);
    player.setReady(true);
    expect(player.ready).toEqual(true);
  });

  test('player leave', () => {
    player.leaveGame();
    expect(player.gameId).toBe(game.id);
    expect(player.ready).toBe(false);
  });
});
