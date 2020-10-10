import { PinochleDeck } from "../../../cards";

describe("Pinochle Deck", () => {
  const deck = new PinochleDeck();
  test("fresh deck", () => {
    expect(deck.cards.length).toBe(48);
    expect(deck.totalLength).toBe(48);
    expect(deck.drawPile.length).toBe(0);
    expect(deck.remainingLength).toBe(0);
    expect(deck.cards[0]).toHaveProperty("suit", "spades");
    expect(deck.cards[0]).toHaveProperty("rank", "9");
  });
  test("shuffle Deck", () => {
    deck.shuffle();
    expect(deck.drawPile.length).toBe(48);
    //every card exists in the draw pile
    for (let card of deck.cards) {
      expect(deck.drawPile).toContain(card);
    }
    let hand = deck.draw(4);

    expect(deck.drawPile.length).toBe(44);
    expect(deck.totalLength).toBe(48);
    expect(deck.remainingLength).toBe(44);
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
    const hand3 = deck.draw(48);
    expect(hand3.length).not.toBe(48);
    expect(() => {
      deck.draw();
    }).toThrow("Deck: Cannot draw from deck, no cards remaining");
  });
});
