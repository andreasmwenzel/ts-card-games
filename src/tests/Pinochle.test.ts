//"use strict";

import { Pinochle } from "../index";

const game = new Pinochle("Pinochle1");

test("imports Hearts", () => {
  expect(game).toHaveProperty("id", "Pinochle1");
});
