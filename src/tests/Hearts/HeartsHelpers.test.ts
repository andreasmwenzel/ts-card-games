//"use strict";
import {
  HeartsPlayer,
  Hearts,
  HeartsGameInfo,
  HeartsGamePhase,
  HeartsPassDirection,
  HeartsPlayerInfo,
  GameState,
  nextPassDirection,
} from '../../index';
import seedrandom = require('seedrandom');
import {Card, clubs, four, hearts, spades} from 'ts-cards';

describe('nextPassDirection', () => {
  test('left', () => {
    expect(nextPassDirection(HeartsPassDirection.LEFT)).toBe(
      HeartsPassDirection.RIGHT
    );
  });
  test('right', () => {
    expect(nextPassDirection(HeartsPassDirection.RIGHT)).toBe(
      HeartsPassDirection.ACROSS
    );
  });
  test('across', () => {
    expect(nextPassDirection(HeartsPassDirection.ACROSS)).toBe(
      HeartsPassDirection.KEEP
    );
  });
  test('keep', () => {
    expect(nextPassDirection(HeartsPassDirection.KEEP)).toBe(
      HeartsPassDirection.LEFT
    );
  });
});
