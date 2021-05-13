import {
  CardGame,
  CardGameInfo,
  GameState,
  CardGameRules,
  PlayerData,
  PlayerInfo,
} from '../CardGame';
import {
  Suit,
  Card,
  Deck,
  StandardDeck,
  standardCardCompare,
  two,
  clubs,
  queen,
  spades,
  hearts,
  Rank,
} from 'ts-cards';
import {v4 as uuidv4} from 'uuid';
import {CardGameTrick} from '../mechanics/CardGameTrick';
import {HeartsPlayer} from './HeartsPlayer';

export enum HeartsGamePhase {
  DEAL = 'Deal',
  PASS = 'Pass',
  PLAY = 'Play',
}
export enum HeartsPassDirection {
  LEFT = 'Left',
  RIGHT = 'Right',
  ACROSS = 'Across',
  KEEP = 'Keep',
}
export function nextPassDirection(
  dir: HeartsPassDirection
): HeartsPassDirection {
  switch (dir) {
    case HeartsPassDirection.LEFT:
      return HeartsPassDirection.RIGHT;
    case HeartsPassDirection.RIGHT:
      return HeartsPassDirection.ACROSS;
    case HeartsPassDirection.ACROSS:
      return HeartsPassDirection.KEEP;
    default:
      return HeartsPassDirection.LEFT;
  }
}

export interface HeartsGameRules extends CardGameRules {
  players: number;
  queenBreaksHearts: boolean;
  passingCount: number;
}

export interface HeartsPlayerData extends PlayerData {
  player: HeartsPlayer;
  score: number[];
  round: HeartsPlayerRoundData;
}

export interface HeartsPlayerRoundData extends HeartsPlayerRoundInfo {
  cardsDealt: Card[];
  cardsPassed: Card[];
  cardsReceived: Card[];
}

export interface HeartsPlayerRoundInfo {
  hasPassed: boolean;
  points: number;
  cardsTaken: Card[];
  cardsPlayed: Card[];
}

export interface HeartsPlayerInfo extends PlayerInfo {
  score: number[] | undefined;
  round: HeartsPlayerRoundInfo;
}

export interface HeartsGameInfo extends CardGameInfo {
  gamePhase: HeartsGamePhase;
  passDirection: HeartsPassDirection;
  players: HeartsPlayerInfo[];
  rules: HeartsGameRules;
}

export interface HeartsGameData extends HeartsGameInfo {
  gamePhase: HeartsGamePhase;
  players: HeartsPlayerData[];
  deck: Deck;
  currentPlayer: number;
  dealer: number;
}

export class Hearts extends CardGame {
  protected gameData: HeartsGameData;

  constructor(id?: string, data?: HeartsGameData) {
    super(id, data);

    if (data) {
      this.gameData = data;
    } else {
      this.gameData = {
        id: id ? id : uuidv4(),
        players: [],
        gameState: GameState.WAITING_FOR_PLAYERS,
        gamePhase: HeartsGamePhase.DEAL,
        passDirection: HeartsPassDirection.KEEP,
        deck: new StandardDeck(),
        rules: {
          players: 4,
          queenBreaksHearts: false,
          passingCount: 3,
        },
        currentPlayer: 0,
        dealer: 0,
      };
    }
  }

  public get rules() {
    return this.gameData.rules;
  }

  private playerToLead = 0;
  private firstTurn = false;
  private heartsBroken = false;
  private currentTrick: CardGameTrick<HeartsPlayerData> | null = null;

  public get gameInfo(): HeartsGameInfo {
    const info = {
      id: this.gameData.id,
      gameState: this.gameData.gameState,
      gamePhase: this.gameData.gamePhase,
      passDirection: this.passDirection,
      players: new Array<HeartsPlayerInfo>(),
      rules: this.gameData.rules,
    };

    for (const p of this.gameData.players) {
      info.players.push({
        name: p.player.name,
        position: p.position,
        isReady: p.isReady,
        leftTable: p.leftTable,
        score: p.score,
        round: {
          points: p.round.points,
          hasPassed: p.round.hasPassed,
          cardsPlayed: p.round.cardsPlayed,
          cardsTaken: p.round.cardsTaken,
        },
      });
    }

    return info;
  }

  public get gamePhase(): HeartsGamePhase {
    return this.gameData.gamePhase;
  }
  public get passDirection(): HeartsPassDirection {
    return this.gameData.passDirection;
  }

  protected startGame(): void {
    for (const p of this.gameData.players) {
      p.score = [];
    }
    this.startNewRound();
  }

  public addPlayer(player: HeartsPlayer, position = -1): number {
    const x = super.addPlayer(player, position);
    const playerData = this.findPlayerData(this.gameData.players, player);
    playerData.score = [];
    playerData.round = {
      hasPassed: false,
      cardsDealt: [],
      cardsPassed: [],
      cardsReceived: [],
      cardsPlayed: [],
      cardsTaken: [],
      points: 0,
    };
    return x;
  }

  public playCard(player: HeartsPlayer, card: Card) {
    if (
      this.gameState !== GameState.ACTIVE ||
      this.gamePhase !== HeartsGamePhase.PLAY
    ) {
      throw new Error(
        'Playing Error: Not in the playing phase or active gamestate'
      );
    }
    const playerData = this.gameData.players[this.gameData.currentPlayer];
    if (playerData.player !== player) {
      throw new Error("Playing Error: Not this player's turn");
    }

    if (!playerData.hand.includes(card)) {
      throw new Error('Playing Error: player does not have that card');
    }

    if (this.gameData.currentPlayer === this.playerToLead) {
      if (this.firstTurn) {
        //first card played every round must be the two of clubs `
        if (!(card.suit === clubs && card.rank === two)) {
          throw new Error('Playing Error: first card must be a two of clubs');
        }
        this.firstTurn = false;
      }
      if (
        !this.heartsBroken &&
        card.suit === hearts &&
        !this.hasOnlyHearts(playerData)
      ) {
        //can't play hearts unless player has no other cards
        throw new Error('Playing Error: Hearts has not been Broken');
      }
      this.currentTrick = new CardGameTrick(
        playerData,
        card,
        standardCardCompare
      );
    } else {
      //check if player has any of leading suit
      if (this.currentTrick) {
        if (card.suit !== this.currentTrick.suit) {
          if (this.hasSuit(playerData, this.currentTrick.suit)) {
            throw new Error('Playing Error: Must Follow Suit');
          }
        }
      }
      this.currentTrick?.addCard(card);
    }

    playerData.round.cardsPlayed.push(card);
    this.removeCardFromPlayer(playerData, card);

    if (card.suit === hearts) {
      this.heartsBroken = true;
    }
    if (
      this.rules.queenBreaksHearts &&
      card.rank === queen &&
      card.suit === spades
    ) {
      this.heartsBroken = true;
    }

    //advance current player
    this.gameData.currentPlayer =
      (this.gameData.currentPlayer + 1) % this.gameData.rules.players;

    //resolve the trick
    if (this.currentTrick?.length === this.gameData.rules.players) {
      //get winner of trick
      const winningPlayerData = this.currentTrick.winnningPlayerData;
      if (!winningPlayerData) {
        throw new Error('No winner found in this trick');
      }

      this.playerToLead = winningPlayerData.position;
      for (const card of this.currentTrick.cards) {
        if (card.suit === hearts) {
          winningPlayerData.round.points += 1;
        }
        if (card.suit === spades && card.rank === queen) {
          winningPlayerData.round.points += 13;
        }
      }

      //if player still has cards, start a new trick
      if (winningPlayerData.hand.length > 0) {
        this.startNewTrick(winningPlayerData);
      } else {
        this.scoreRound();
      }
    }
  }
  private scoreRound() {
    //finish the round
    let endGame = false;
    for (const p of this.gameData.players) {
      if (p.round.points === 26) {
        p.round.points = 0;
        //shot the moon
        for (const pl of this.gameData.players) {
          if (pl !== p) {
            pl.round.points = 26;
          }
        }
      }
    }
    for (const p of this.gameData.players) {
      p.score.push(p.round.points);
      const totalScore = p.score.reduce((a, b) => a + b, 0);
      if (totalScore >= 100) {
        endGame = true;
      }
    }
    if (endGame) {
      this.gameData.gameState = GameState.FINISHED;
    } else {
      this.gameData.dealer =
        (this.gameData.dealer + 1) % this.gameData.rules.players;
      this.startNewRound();
    }
  }

  public passCards(player: HeartsPlayer, cards: Card[]) {
    if (this.gamePhase !== HeartsGamePhase.PASS) {
      throw new Error('Passing Error: Not in the passing phase');
    }
    if (cards.length !== this.rules.passingCount) {
      throw new Error(
        `Passing Error: Must pass ${this.rules.passingCount} cards`
      );
    }

    const playerData = this.findPlayerData(this.gameData.players, player);
    if (playerData.round.hasPassed) {
      throw new Error(
        'Passing Error: player has already passed cards this round'
      );
    }
    for (const card of cards) {
      if (!playerData.hand.includes(card)) {
        throw new Error('Passing Error: player does not have that card');
      }
    }
    playerData.round.cardsPassed = cards;
    playerData.round.hasPassed = true;

    let allPassed = true;
    for (const p of this.gameData.players) {
      if (!p.round.hasPassed) {
        allPassed = false;
        break;
      }
    }

    if (!allPassed) {
      return;
    }

    //remove cards from players and add to hand of who they were passing to
    for (const p of this.gameData.players) {
      const cards = p.round.cardsPassed;
      let passedToPlayerData: HeartsPlayerData;
      switch (this.passDirection) {
        case HeartsPassDirection.LEFT:
          passedToPlayerData = this.gameData.players[
            (p.position + 1) % this.gameData.rules.players
          ];
          break;
        case HeartsPassDirection.RIGHT:
          passedToPlayerData = this.gameData.players[
            (p.position - 1) % this.gameData.rules.players
          ];
          break;
        case HeartsPassDirection.ACROSS:
          passedToPlayerData = this.gameData.players[
            (p.position + 2) % this.gameData.rules.players
          ];
          break;
        default:
          throw new Error('Pass cards error: unexepcted pass direction');
      }

      this.removeCardsFromPlayer(p, cards);
      this.addCardsToPlayer(passedToPlayerData, cards);
      passedToPlayerData.round.cardsReceived = cards;
    }
    this.gameData.gamePhase = HeartsGamePhase.PLAY;
  }

  private startNewTrick(playerData: HeartsPlayerData) {
    this.currentTrick = null;
    this.playerToLead = playerData.position;
    this.gameData.currentPlayer = this.playerToLead;
  }

  private startNewRound(): void {
    this.gameData.gamePhase = HeartsGamePhase.DEAL;
    //advance passing direction
    this.gameData.passDirection = nextPassDirection(this.passDirection);

    for (const p of this.gameData.players) {
      p.round = {
        points: 0,
        cardsDealt: [],
        cardsPassed: [],
        cardsPlayed: [],
        cardsReceived: [],
        cardsTaken: [],
        hasPassed: false,
      };
    }

    //deal the deck
    this.gameData.deck.shuffle();

    let dealTo = (this.gameData.dealer + 1) % this.gameData.rules.players;
    while (this.gameData.deck.drawPile.length) {
      const p = this.gameData.players[dealTo];
      this.addCardsToPlayer(p, this.gameData.deck.draw());

      dealTo = (dealTo + 1) % this.gameData.rules.players;
    }

    for (const p of this.gameData.players) {
      p.round.cardsDealt = p.hand;
    }

    //set flag for playing 2 of clubs and
    this.firstTurn = true;
    this.heartsBroken = false;

    //set phase to passing
    if (this.passDirection === HeartsPassDirection.KEEP) {
      this.startPlayingPhase();
    } else {
      this.gameData.gamePhase = HeartsGamePhase.PASS;
    }
  }

  private startPlayingPhase() {
    this.gameData.gamePhase = HeartsGamePhase.PLAY;
    this.startNewTrick(this.findTwoOfClubs());
  }
  private findTwoOfClubs(): HeartsPlayerData {
    for (const p of this.gameData.players) {
      if (this.hasTwoOfClubs(p)) {
        return p;
      }
    }
    throw new Error('Two of Clubs: No player had the two of clubs');
  }

  public hasCard(
    playerData: HeartsPlayerData,
    rank: Rank,
    suit: Suit
  ): boolean {
    for (const card of playerData.hand) {
      if (card.rank === rank && card.suit === suit) {
        return true;
      }
    }
    return false;
  }

  public hasTwoOfClubs(playerData: HeartsPlayerData): boolean {
    return this.hasCard(playerData, two, clubs);
  }

  public hasSuit(playerData: HeartsPlayerData, suit: Suit): boolean {
    for (const card of playerData.hand) {
      if (card.suit === suit) {
        return true;
      }
    }
    return false;
  }

  public hasOnlyHearts(playerData: HeartsPlayerData): boolean {
    for (const card of playerData.hand) {
      if (card.suit !== hearts) {
        return false;
      }
    }
    return true;
  }
}
