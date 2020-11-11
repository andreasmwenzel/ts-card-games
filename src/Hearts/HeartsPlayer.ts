import { Suit, Card, compareCards, } from "../cards";
import { Player } from "../Player";


export class HeartsPlayer extends Player {
  
  private hand : Card[] = [];
  

  constructor(name: string, id: string) {
    super(name, id);
  }

  public receiveCard(card:Card){
    this.hand.push(card);
    
    this.hand.sort((a:Card, b:Card):number=>{
      if(!this.game){
        throw new Error("No game")
      }
      return compareCards(a, b, this.game.rankValues , this.suitValues, null)
    })
    
    
  }

  public hasTwoOfClubs():boolean{
    for(let card of this.hand){
      if(card.rank=="2" && card.suit=="clubs"){
        return true;
      }
    }
    return false;
  }
}