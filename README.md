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
const game = new Hearts("Hearts1");

const p1 = new HeartsPlayer("joe", "1");
const p2 = new HeartsPlayer("jim", "2");
const p3 = new HeartsPlayer("jessica", "3");
const p4 = new HeartsPlayer("julie", "4")

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

Finish building out game logic for Hearts and Pinnochle

```

```
