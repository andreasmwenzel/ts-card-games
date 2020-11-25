import { CardGame, GameState } from "../CardGame";
import { Card, Deck, StandardDeck, RankValues, defaultRankValue , Trick} from "../cards";
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
  private dealer : number = 0;
  public readonly players: HeartsPlayer[] = [];
  private _rules:HeartsRules = {
    players : this.playerCount,
    queenBreaksHearts : false
  }
  public get rules(){return this._rules};
  private gamePhase: HeartsGamePhase;
  private passDirection: HeartsPassDirection;
  private currentPlayer: Player|null = null;
  private playerToLead: Player|null = null;
  private firstTurn: boolean = false;
  private heartsBroken: boolean = false;
  private playedCards:Map<Card,Player>;
  private currentTrick:Trick|null = null;
  public rankValues:RankValues = defaultRankValue;

  public get gameInfo():any{
    return [this._gameState, this.gamePhase, this.passDirection]
  }
  
  constructor(id: string) {
    super(id);
    this.deck = new StandardDeck();
    this.gamePhase = HeartsGamePhase.DEAL;
    this.passDirection = HeartsPassDirection.KEEP; //initialize to keep so starting a new phase advances it to Left
    this.playedCards = new Map<Card, Player>();
  }

  protected startGame(): void{
    this.startNewRound();
  }

  public playCard(player:HeartsPlayer, card:Card){
    if(this.gamePhase != HeartsGamePhase.PLAY){
      throw new Error("Playing Error: Not in the playing phase")
    }
    if(this.currentPlayer != player){
      throw new Error("Playing Error: Not this player's turn")
    }

    if(this.playerToLead == player){
      
      if(this.firstTurn){
        //first card played every round must be the two of clubs `
        if(! (card.suit=="clubs" && card.rank=="2" )){
          throw new Error("Playing Error: first card must be a two of clubs");
        }
        this.firstTurn = false;
      }
      if(!this.heartsBroken && card.suit=="hearts"){
        throw new Error("Playing Error: Hearts not Broken")
      }
      this.currentTrick = new Trick(card, this.rankValues)
    } else{
      //check if player has any of leading suit
      if(this.currentTrick){
        if(card.suit !== this.currentTrick.suit){
          if(player.hasSuit(this.currentTrick.suit)){
            throw new Error("Playing Error: Must Follow Suit");
          }
        }
      }
      this.currentTrick?.addCard(card);
    }
    this.playedCards.set(card, player);


    //resolve the trick
    if(this.currentTrick?.length == 4){

      for(let card of this.currentTrick.cards){
        if(card.suit == "hearts"){
          player.roundPoints += 1;
        }
        if(card.suit == "spades" && card.rank == "Q"){
          player.roundPoints += 13;
        }
      }
      let newLead:Player|undefined = this.playedCards.get(this.currentTrick.winner)
      if(!newLead){
        throw new Error("Error finding winning player of previous trick.") //This should never happen
      }
      //if player still has cards, start a new trick
      if(player.handLength > 0){
        this.startNewTrick(newLead)
      }
      else{ //finish the round
        let endGame = false;
        for(let p of this.players){
          if(p.roundPoints == 26){ //shot the moon
            for(let pl of this.players){
              if(pl != p){
                p.totalPoints += 26;
              }
            }
          } else{
            p.totalPoints += p.roundPoints
          }
          if(p.totalPoints >= 100){
            endGame = true;
          }
        }
        if(endGame){
          console.log("game over");
          this._gameState=GameState.FINISHED;
        }
        else{
          this.startNewRound()
        }
      }
      
    }
  }

  public passCards(player:HeartsPlayer, cards:Card[]){
    if(this.gamePhase != HeartsGamePhase.PASS){
      throw new Error("Passing Error: Not in the passing phase")
    }
  }

  startNewTrick(player:Player){
    this.currentTrick = null;
    this.currentPlayer = player;
    this.playedCards = new Map<Card, Player>()
  }

  private startNewRound(): void{
    this.gamePhase = HeartsGamePhase.DEAL;
    //advance passing direction
    this.passDirection = nextPassDirection(this.passDirection);
    

    //deal the deck
    this.deck.shuffle();

    let dealTo = this.dealer;
    while(this.deck.drawPile.length){
      let p = this.players[dealTo]
      p.receiveCard(this.deck.draw()[0]);
      dealTo = (dealTo + 1) % this.playerCount;
    }
    this.dealer = (this.dealer+1) % 4

    //set flag for playing 2 of clubs and 
    this.firstTurn = true;
    this.heartsBroken = false;

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
    this.startNewTrick(findTwoOfClubs(this.players));
  }
}


function findTwoOfClubs(players: HeartsPlayer[]):HeartsPlayer{
  for(let player of players){
    if(player.hasTwoOfClubs()){
      return player;
    }
  }
  throw new Error("Two of Clubs: No player had the two of clubs");
}

function nextPassDirection(dir:HeartsPassDirection):HeartsPassDirection{
  switch(dir){
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