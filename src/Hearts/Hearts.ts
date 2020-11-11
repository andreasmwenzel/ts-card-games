import { CardGame } from "../CardGame";
import { Card, Deck, StandardDeck, RankValues, defaultRankValue } from "../cards";
import { Player } from "../Player";
import { HeartsPlayer } from "./HeartsPlayer";

enum HeartsGamePhase {
  DEAL = "Deal",
  PASS = "Pass",
  PLAY = "Play",
  SCORE = "Score",
}
enum HeartsPassDirection{
  LEFT = "Left",
  RIGHT = "Right",
  ACROSS = "Across",
  KEEP = "Keep"
}

type HeartsRules = {
  players: number;
  queenBreaksHearts:boolean;
}

export class Hearts extends CardGame {
  private deck: Deck;
  protected playerCount: number = 4;
  public readonly players: HeartsPlayer[] = [];
  private _rules:HeartsRules = {
    players : this.playerCount,
    queenBreaksHearts : false
  }
  public get rules(){return this._rules};
  private gamePhase: HeartsGamePhase;
  private passDirection : HeartsPassDirection;

  public rankValues:RankValues = defaultRankValue;
  
  public get gameInfo():any{
    return [this._gameState, this.gamePhase, this.passDirection]
  }
  
  constructor(id: string) {
    super(id);
    this.deck = new StandardDeck();
    this.gamePhase = HeartsGamePhase.DEAL;
    this.passDirection = HeartsPassDirection.LEFT;
  }

  protected startGame(): void{
    this.startNewRound(HeartsPassDirection.LEFT);
  }

  private playCard(player:HeartsPlayer, card:Card){

  }
  private passCard(player:HeartsPlayer, cards:Card[]){

  }

  private startNewRound(passDir:HeartsPassDirection): void{
    this.gamePhase = HeartsGamePhase.DEAL;
    //deal the deck
    this.deck.shuffle();

    let dealTo = 0;
    while(this.deck.drawPile.length){
      let p = this.players[dealTo]
      p.receiveCard(this.deck.draw()[0]);
      dealTo = (dealTo + 1) % this.playerCount;
    }

    //set phase to passing
    if(this.passDirection === HeartsPassDirection.KEEP){
      this.startPlayingPhase()
    }
    else{
      this.startPassingPhase();
    }

  }

  private startPassingPhase(){
    this.gamePhase == HeartsGamePhase.PASS;
  }

  private startPlayingPhase(){
    this.gamePhase == HeartsGamePhase.PLAY;
    //find the 2 of clubs
    
  }
}


function findTwoOfClubs(players: HeartsPlayer[]):Player{
  for(let player of players){
    if(player.hasTwoOfClubs()){
      return player;
    }
  }
  throw new Error("Two of Clubs: No player had the two of clubs");
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


