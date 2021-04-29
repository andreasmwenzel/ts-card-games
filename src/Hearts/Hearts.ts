import { CardGame, GameState, PlayerData } from "../CardGame";
import { Card, Deck, StandardDeck, Trick, standardCardCompare, two, clubs, queen, spades, hearts} from "ts-cards";
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

type HeartsRules = {
  players: number;
  queenBreaksHearts:boolean;
  passingCount:number;
}

interface HeartsPlayerData extends PlayerData {
  player:HeartsPlayer,
  roundPoints:number,
  totalPoints:number
}

export class Hearts extends CardGame {
  
  private deck: Deck;
  protected playerCount: number = 4;
  protected playerData:HeartsPlayerData[] = [];
  
  private dealer : number = 0;
  private _rules:HeartsRules = {
    players : this.playerCount,
    queenBreaksHearts : false,
    passingCount:3
  }
  public get rules(){return this._rules};
  
  private gamePhase: HeartsGamePhase;
  private passDirection: HeartsPassDirection;
  private currentPlayer: number = 0;
  private playerToLead: number = 0;
  private firstTurn: boolean = false;
  private heartsBroken: boolean = false;
  private playedCards:Map<Card,Player>;
  private startingHandByPlayer:Map<Player, Card[]>;
  private cardsPassedByPlayer:Map<Player, Card[]>
  private currentTrick:Trick|null = null;

  public get gameInfo():any{
    return [this._gameState, this.gamePhase, this.passDirection]
  }
  
  constructor(id: string) {
    super(id);
    this.deck = new StandardDeck();
    this.gamePhase = HeartsGamePhase.DEAL;
    this.passDirection = HeartsPassDirection.KEEP; //initialize to keep so starting a new phase advances it to Left
    this.playedCards = new Map<Card, Player>();
    this.startingHandByPlayer = new Map<Player, Card[]>();
    this.cardsPassedByPlayer = new Map<Player, Card[]>();
  }

  protected startGame(): void{
    this.startNewRound();
  }

  public addPlayer(player:Player, position:number=-1):number{
    if(player instanceof HeartsPlayer){
      return super.addPlayer(player, position);
    } else{
      throw new Error("Join Game Error: Only Hearts Players can join Hearts Games")
    }
  }

  public playCard(player:HeartsPlayer, card:Card){
    if(this.gameState != GameState.ACTIVE || this.gamePhase != HeartsGamePhase.PLAY){
      throw new Error("Playing Error: Not in the playing phase or active gamestate")
    }
    if(this.playerData[this.currentPlayer].player != player){
      throw new Error("Playing Error: Not this player's turn")
    }

    if(this.currentPlayer == this.playerToLead){
      if(this.firstTurn){
        //first card played every round must be the two of clubs `
        if(! (card.suit==clubs && card.rank==two )){
          throw new Error("Playing Error: first card must be a two of clubs");
        }
        this.firstTurn = false;
      }
      if(!this.heartsBroken && card.suit==hearts&& !player.hasOnlyHearts()){
        //can't play hearts unless player has no other cards
        throw new Error("Playing Error: Hearts has not been Broken")
      }
      this.currentTrick = new Trick(card, standardCardCompare)
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
    this.removeCardFromPlayer(this.playerData[this.currentPlayer], card);

    if(card.suit == hearts){
      this.heartsBroken = true;
    }
    if(this.rules.queenBreaksHearts && card.rank == queen && card.suit == spades){
      this.heartsBroken = true;
    }

    //advance current player
    this.currentPlayer = (this.currentPlayer + 1) % this.playerCount;

    //resolve the trick
    if(this.currentTrick?.length == 4){
      //get winner of trick
      const winner = this.playedCards.get(this.currentTrick.winner);
      if(!winner){
        throw new Error("No winner found in this trick");
      }

      const winnerData = this.findPlayerData(this.playerData, winner);
      this.playerToLead = winnerData.position;

      for(let card of this.currentTrick.cards){
        if(card.suit == hearts){
          winnerData.roundPoints += 1;
        }
        if(card.suit == spades && card.rank == queen){
          winnerData.roundPoints += 13;
        }
      }
      
      //if player still has cards, start a new trick
      if(player.handLength > 0){
        this.startNewTrick(winnerData.player)
      }
      else{ //finish the round
        let endGame = false;
        for(let p of this.playerData){
          if(p.roundPoints == 26){ //shot the moon
            for(let pl of this.playerData){
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
          this._gameState=GameState.FINISHED;
        }
        else{
          this.dealer = (this.dealer+1) % this.playerCount;
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

  private startNewTrick(player:Player){
    this.currentTrick = null;
    this.currentPlayer = this.playerToLead;
  }

  private startNewRound(): void{
    this.gamePhase = HeartsGamePhase.DEAL;
    this.playedCards = new Map<Card, Player>();
    this.cardsPassedByPlayer = new Map<Player, Card[]>();
    //advance passing direction
    this.passDirection = nextPassDirection(this.passDirection);

    for(let p of this.playerData){
      p.roundPoints = 0;
    }
    
    //deal the deck
    this.deck.shuffle();

    let dealTo = (this.dealer + 1 ) % this.playerCount;
    while(this.deck.drawPile.length){
      let p = this.playerData[dealTo]
      this.addCardsToPlayer(p, this.deck.draw())
      
      dealTo = (dealTo + 1) % this.playerCount;
    }
    
    for(const p of this.playerData){
      
      this.startingHandByPlayer.set(p.player, p.hand);
    }

    //set flag for playing 2 of clubs and 
    this.firstTurn = true;
    this.heartsBroken = false;

    //set phase to passing
    if(this.passDirection === HeartsPassDirection.KEEP){
      this.startPlayingPhase()
    }
    else{
      this.gamePhase = HeartsGamePhase.PASS;
    }
  }

  private startPlayingPhase(){
    this.gamePhase = HeartsGamePhase.PLAY;
    this.startNewTrick(this.findTwoOfClubs());
  }
  private findTwoOfClubs():HeartsPlayer{
    for(let p of this.playerData){
      if(p.player.hasTwoOfClubs()){
        return p.player;
      }
    }
    throw new Error("Two of Clubs: No player had the two of clubs");
  }
}


