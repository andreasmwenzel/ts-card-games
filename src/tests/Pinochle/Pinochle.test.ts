//"use strict";

import {Pinochle} from '../../index';

const game = new Pinochle({name: 'Pinochle1'});

test('imports Hearts', () => {
  expect(game).toHaveProperty('name', 'Pinochle1');
});
