import {Card, Trick, defaultRankValue} from "../../cards";

const card = new Card("spades", "A");
const card2 = new Card("diamonds", "Q");
const card3 = new Card("clubs", "2");
const card4 = new Card("diamonds", "Q");

let map = new Map<Card, number>(); //keep track of the two queen of diamonds
map.set(card2,2);
map.set(card4,4);

let trick:Trick;
describe("trick without trump", ()=>{
  test("create a new Trick", () => {
    trick = new Trick(card, defaultRankValue);
    expect(trick.length).toBe(1);
    expect(trick.winner).toBe(card);
    expect(trick.suit).toBe("spades");
  });

  test("add to existing trick", ()=>{
    trick.addCard(card2);
    expect(trick.length).toBe(2);
    expect(trick.winner).toBe(card);
    expect(trick.suit).toBe("spades");
  })
})

describe("trick with trump", ()=>{
  test("create a new Trick", () => {
    trick = new Trick(card2, defaultRankValue,"clubs");
    expect(trick.length).toBe(1);
    expect(trick.winner).toBe(card2);
    expect(trick.suit).toBe(card2.suit);
  });

  test("add to existing trick", ()=>{
    trick.addCard(card);
    trick.addCard(card4)
    expect(map.get(trick.winner)).toEqual(2); //the first queen of diamonds is the current winning card
    trick.addCard(card3);
    expect(trick.length).toBe(4);
    expect(trick.winner).toBe(card3); //the 2 of clubs wins as trump
    expect(trick.suit).toBe(card2.suit); //but the trick "suit" is still diamonds
  })
})
