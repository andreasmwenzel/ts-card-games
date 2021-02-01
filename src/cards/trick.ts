import{ Card, compareCards, Suit, SuitValues, RankValues } from "./card"


export class Trick{
  private leadSuit:Suit = "clubs";
  public cards:Card[] = [];
  private rankValues;
  private suitValues:SuitValues= {
    "clubs" : 1,
    "hearts" : 1,
    "diamonds" : 1,
    "spades" : 1
  };

  constructor(card:Card, rankValues:RankValues, trump:Suit|null = null, ){
    this.leadSuit = card.suit;
    
    this.rankValues = rankValues;
    this.suitValues[card.suit] += 10;
    if(trump){
      this.suitValues[trump] += 100;
    }

    this.cards.push(card);
  }

  addCard(card:Card ){
    this.cards.push(card);
    this.cards.sort((a,b)=>{return compareCards(a, b,this.rankValues, this.suitValues) * -1 }) //sort high to low
  }

  public get winner(){return this.cards[0]}
  public get length(){return this.cards.length};
  public get suit(){return this.leadSuit};

}