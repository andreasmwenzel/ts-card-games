import { Card, Deck } from "../../cards";

describe("Deck", () => {
  const deck = new Deck();
  test("fresh deck", () => {
    expect(deck.totalLength).toBe(0);
  });
});
