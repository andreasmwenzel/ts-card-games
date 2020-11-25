import { Rank, Suit, Card } from "../../cards";

describe("new card", () => {
  test("ace of spades", () => {
    const ace: Rank = "A";
    const spades: Suit = "spades";
    const aceOfSpades = new Card(spades, ace);

    expect(aceOfSpades).toHaveProperty("rank", "A");
    expect(aceOfSpades).toHaveProperty("suit", "spades");
  });
});

//TODO: make card compare tests