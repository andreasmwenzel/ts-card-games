import { StandardDeck } from "../../../cards";

describe("Pinochle Deck", () => {
  const deck = new StandardDeck();
  test("fresh deck", () => {
    expect(deck.cards.length).toBe(52);
    expect(deck.totalLength).toBe(52);
    expect(deck.drawPile.length).toBe(0);
    expect(deck.remainingLength).toBe(0);
    expect(deck.cards[0]).toHaveProperty("suit", "spades");
    expect(deck.cards[0]).toHaveProperty("rank", "2");
  });
  test("shuffle Deck", () => {
    deck.shuffle();
    expect(deck.drawPile.length).toBe(52);
    //every card exists in the draw pile
    for (let card of deck.cards) {
      expect(deck.drawPile).toContain(card);
    }
    let hand = deck.draw(4);

    expect(deck.drawPile.length).toBe(48);
    expect(deck.totalLength).toBe(52);
    expect(deck.remainingLength).toBe(48);
    //after we draw it no longer exists in draw pile
    for (let card of deck.cards) {
      if (hand.includes(card)) {
        expect(deck.drawPile).not.toContain(card);
      } else {
        expect(deck.drawPile).toContain(card);
      }
    }
  });

  let oldDrawPile = deck.drawPile;
  test("shuffle DrawPile", () => {
    deck.shuffleDrawPile();
    //all cards are still in the draw pile
    for (let card of oldDrawPile) {
      expect(deck.drawPile).toContain(card);
    }
  });

  test("draw", () => {
    const hand2 = deck.draw(-1);
    expect(hand2).toStrictEqual([]);
    const hand3 = deck.draw(52);
    expect(hand3.length).not.toBe(52);
    expect(() => {
      deck.draw();
    }).toThrow("Deck: Cannot draw from deck, no cards remaining");
  });
});
