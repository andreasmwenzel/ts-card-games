const { Card } = require("cards");
const Player = require("./Player");

export class CardGame {
  public id: string;
  public active: boolean = false;
  constructor(id: string) {
    this.id = id;
  }
  startGame = () => {
    this.active = true;
  };
}
