import { CardGame } from "../CardGame";
import { Deck, StandardDeck } from "../cards";
import { HeartsPlayer } from "./HeartsPlayer";

enum HeartsGamePhase {
  DEAL = "Deal",
  PASS = "Pass",
  PLAY = "Play",
  SCORE = "Score",
}

export class Hearts extends CardGame {
  private deck: Deck;
  protected playerCount: number = 4;
  constructor(id: string) {
    super(id);
    this.deck = new StandardDeck();
  }
  playCard(): void {}

  protected subscribeToPlayerEvents(player: HeartsPlayer): void {
    player.events.play.on((card) => {
      console.log(card);
    });
    player.events.pass.on((cards) => {
      console.log(cards);
    });
  }
}

//start
//shuffle
//deal

//pass phase
//pass direction

//trick phase
//2 of clubs leads first trick
//collect cards
//ends when players have no cards left at the end of a trick

//scoring
//game over if any player is over 100

//start next round
