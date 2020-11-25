import { Suit, Card, compareCards, defaultRankValue} from "../cards";
import { Player } from "../Player";
import { Hearts } from "./Hearts";


export class HeartsPlayer extends Player {
  
  private hand : Card[] = [];
  public get handLength(){return this.hand.length}
  protected _game?:Hearts;
  public totalPoints:number;
  public roundPoints:number;

  constructor(name: string, id: string) {
    super(name, id);
    this.totalPoints = 0;
    this.roundPoints = 0;
  }

  public receiveCard(card:Card){
    this.hand.push(card);
    
    this.hand.sort((a:Card, b:Card):number=>{
      if(!this._game){
        throw new Error("No game")
      }
      return compareCards(a, b, this._game.rankValues , this.suitValues)
    })
  }

  public playCard(card:Card){
    if(this.hand.includes(card)){
      this._game?.playCard(this, card);
    }else{
      throw new Error("Play Error: Player does not have that card");
    }
  }

  public hasTwoOfClubs():boolean{
    for(let card of this.hand){
      if(card.rank=="2" && card.suit=="clubs"){
        return true;
      }
    }
    return false;
  }
  public hasSuit(suit:Suit):boolean{
    for(let card of this.hand){
      if(card.suit == suit){
        return true;
      }
    }
    return false;
  }
}