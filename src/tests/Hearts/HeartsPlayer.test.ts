import {HeartsPlayer} from '../../Hearts/HeartsPlayer';

describe('Setting Up a game', () => {
  const player = new HeartsPlayer('player1', '1');
  test('create player object', () => {
    expect(player.name).toEqual('player1');
    expect(player.id).toEqual('1');
  });
});
