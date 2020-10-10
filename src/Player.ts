import { Card } from "./cards";
import { Event, events } from "ts-typed-events";

// export declare interface Player {
//   on(event: 'hello', listener: (name: string) => void): this;
//   on(event: string, listener: Function): this;
// }

export abstract class Player {
  public readonly events = events({
    leave: new Event(),
  });

  public readonly name: string;
  public readonly id: string;
  private hand: Card[] = [];
  //public position: number;
  public game?: string;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
    //this.position = position;
  }
  leaveGame() {
    this.events.leave.emit();
  }
}
