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

const p1 = new HeartsPlayer({name: "joe"});
const p2 = new HeartsPlayer({name: "jim"});
const p3 = new HeartsPlayer({name:"jessica"});
const p4 = new HeartsPlayer({name:"julie"});

p1.joinGame(game,0)
p2.joinGame(game,1)
p3.joinGame(game,2)
p4.joinGame(game,3)

game.startGame();
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
