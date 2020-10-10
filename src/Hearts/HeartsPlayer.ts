import { Card } from "../cards";
import { Player } from "../Player";
import { Event, events } from "ts-typed-events";

export class HeartsPlayer extends Player {
  constructor(name: string, id: string) {
    super(name, id);
  }

  public readonly events = events.concat(super.events, {
    play: new Event<Card>(),
    pass: new Event<Card[]>(),
  });
}
