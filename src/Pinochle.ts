const CardGame = require("./CardGame");

/**
 * @class Hearts
 * @param id {string}
 * @description Class representing a Hearts card game
 */
export class Pinochle extends CardGame {
  constructor(id: string) {
    super(id);
  }
}
