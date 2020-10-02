//"use strict";

import { Hearts } from "../index";

const game = new Hearts("Hearts1");

test("imports Hearts", () => {
  expect(game).toHaveProperty("id", "Hearts1");
});
