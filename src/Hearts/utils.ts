import {HeartsPassDirection} from './types';

export function nextPassDirection(
  dir: HeartsPassDirection
): HeartsPassDirection {
  switch (dir) {
    case HeartsPassDirection.LEFT:
      return HeartsPassDirection.RIGHT;
    case HeartsPassDirection.RIGHT:
      return HeartsPassDirection.ACROSS;
    case HeartsPassDirection.ACROSS:
      return HeartsPassDirection.KEEP;
    default:
      return HeartsPassDirection.LEFT;
  }
}
