# ts-card-games

card games library built entirely in typescript. Currently only has Hearts but can be used as a framework to build any game that uses cards

## Install through npm

```
npm install ts-card-games
```

## Getting Started Using Built-In Hearts Game

starting a new Game

```
import {Hearts, HeartsPlayer} from 'ts-card'games'
const game = new Hearts("Hearts1");
```

initializing the players

```
const joe = new HeartsPlayer("joe", "1");
const jim = new HeartsPlayer("jim", "2");
const jess = new HeartsPlayer("jessica", "3");
const julie = new HeartsPlayer("julie", "4")

```

adding players to the game

```
joe.joinGame(game,0)
jim.joinGame(game,1)
jess.joinGame(game,2)
julie.joinGame(game,3)
```

ready checks

```
joe.ready = true;
jim.ready = true;
jess.ready = true;
julie.ready = true;
```

At this point cards are dealt and the game is active. Game and player info can be checked with a variety of getters

```
game.gameState
game.gamePhase
game.gameInfo

joe.hand
jess.position
```

For Hearts, we also have a game phase and a pass direction

```
game.gameInfo.passDirection
game.gameInfo.gamePhase
```

Player actions are defined in Hearts as passCards and playCard

```
joe.passCards(joe.hand[0],joe.hand[1],joe.hand[2])
jess.playCard(jess.hand[0])
```

These methods will throw errors if they cannot be completed for any reason including:

- wrong gameState or gamePhase
- not player's turn
- cards not in player's hand
- passing the wrong number of cards

# Documentation

See the [wiki](https://github.com/andreasmwenzel/ts-card-games/wiki) for more.
