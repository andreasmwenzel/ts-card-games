import {HeartsPlayer} from '../../Hearts/HeartsPlayer';

describe('Setting Up a game', () => {
  const player = new HeartsPlayer({name: 'player1', id: '1'});
  test('create player object', () => {
    expect(player.name).toEqual('player1');
    expect(player.id).toEqual('1');
  });
});
