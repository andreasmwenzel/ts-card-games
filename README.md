# ts-card-games

Hearts, Pinochle and more in typescript

### Features

- Cards
- Decks
- Players
- Games
  - Hearts
  - Pinochle

### Examples

```
const game = new Hearts({name: "Hearts1"});

const p1 = game.addPlayer("joe");
const p2 = game.addPlayer("jim");
const p3 = game.addPlayer({name:"jess"});
const p4 = game.addPlayer("jules");

p1.setReady(true);
p2.setReady(true);
p3.setReady(true);
p4.setReady(true);
```

## Development

### Build

`npm run build`

### Test

`npm run test`

### Todo

Finish building out game logic for Hearts and Pinochle

```

```
