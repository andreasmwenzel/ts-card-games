const CardGame = require("./CardGame");

/**
 * @class Hearts
 * @param id {string}
 * @description Class representing a Hearts card game
 */
class Pinochle extends CardGame {
  constructor(id: string) {
    super(id);
  }
}

export default Pinochle;
