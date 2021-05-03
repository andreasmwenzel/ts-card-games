import {
  CardGame,
  CardGameInfo,
  CardGameData,
  GameState,
  PlayerData,
  PlayerInfo,
} from '../CardGame';
import {
  Suit,
  Card,
  Deck,
  StandardDeck,
  Trick,
  standardCardCompare,
  two,
  clubs,
  queen,
  spades,
  hearts,
} from 'ts-cards';
import {v4 as uuidv4} from 'uuid';
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
function nextPassDirection(dir: HeartsPassDirection): HeartsPassDirection {
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

export type HeartsRules = {
  players: number;
  queenBreaksHearts: boolean;
  passingCount: number;
};

interface HeartsPlayerData extends PlayerData {
  player: HeartsPlayer;
  score: number[];
  totalPoints: number;
  roundPoints: number;
  hasPassed: boolean;
}

export interface HeartsPlayerInfo extends PlayerInfo {
  roundPoints: number | undefined;
  score: number[] | undefined;
  totalPoints: number | undefined;
  hasPassed: boolean | undefined;
}

export interface HeartsGameInfo extends CardGameInfo {
  phase: HeartsGamePhase;
  passDir: HeartsPassDirection;
  players: HeartsPlayerInfo[];
}

export interface HeartsGameData extends CardGameData {
  gamePhase: HeartsGamePhase;
  players: HeartsPlayerData[];
  rules: HeartsRules;
  deck: Deck;
  currentPlayer: number;
  passDirection: HeartsPassDirection;
  dealer: number;
}

export class Hearts extends CardGame {
  protected playerCount = 4;
  protected gameData: HeartsGameData;

  constructor(id?: string, data?: HeartsGameData) {
    super();

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

    this.playedCards = new Map<Card, HeartsPlayer>();
    this.startingHandByPlayer = new Map<HeartsPlayer, Card[]>();
    this.cardsPassedByPlayer = new Map<HeartsPlayer, Card[]>();
  }

  public get rules() {
    return this.gameData.rules;
  }

  private playerToLead = 0;
  private firstTurn = false;
  private heartsBroken = false;
  private playedCards: Map<Card, HeartsPlayer>;
  private startingHandByPlayer: Map<HeartsPlayer, Card[]>;
  private cardsPassedByPlayer: Map<HeartsPlayer, Card[]>;
  private currentTrick: Trick | null = null;

  public get gameInfo(): HeartsGameInfo {
    const info = {
      id: this.gameData.id,
      state: this.gameData.gameState,
      phase: this.gameData.gamePhase,
      passDir: this.passDirection,
      players: new Array<HeartsPlayerInfo>(),
    };

    for (const p of this.gameData.players) {
      info.players.push({
        name: p.player.name,
        position: p.position,
        isReady: p.isReady,
        leftTable: p.leftTable,
        roundPoints: p.roundPoints,
        score: p.score,
        totalPoints: p.totalPoints,
        hasPassed: p.hasPassed,
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
      p.totalPoints = 0;
    }
    this.startNewRound();
  }

  public addPlayer(player: HeartsPlayer, position = -1): number {
    return super.addPlayer(player, position);
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
      this.currentTrick = new Trick(card, standardCardCompare);
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

    this.playedCards.set(card, player);
    this.removeCardFromPlayer(
      this.gameData.players[this.gameData.currentPlayer],
      card
    );

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
      (this.gameData.currentPlayer + 1) % this.playerCount;

    //resolve the trick
    if (this.currentTrick?.length === 4) {
      //get winner of trick
      const winningPlayer = this.playedCards.get(this.currentTrick.winner);
      if (!winningPlayer) {
        throw new Error('No winner found in this trick');
      }

      const winningPlayerData = this.findPlayerData(
        this.gameData.players,
        winningPlayer
      );
      this.playerToLead = winningPlayerData.position;

      for (const card of this.currentTrick.cards) {
        if (card.suit === hearts) {
          winningPlayerData.roundPoints += 1;
        }
        if (card.suit === spades && card.rank === queen) {
          winningPlayerData.roundPoints += 13;
        }
      }

      //if player still has cards, start a new trick
      if (winningPlayer.hand.length > 0) {
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
      if (p.roundPoints === 26) {
        p.roundPoints = 0;
        //shot the moon
        for (const pl of this.gameData.players) {
          if (pl !== p) {
            pl.roundPoints = 26;
          }
        }
      }
    }
    for (const p of this.gameData.players) {
      p.score.push(p.roundPoints);
      p.totalPoints += p.roundPoints;
      if (p.totalPoints >= 100) {
        endGame = true;
      }
    }
    if (endGame) {
      this.gameData.gameState = GameState.FINISHED;
    } else {
      this.gameData.dealer = (this.gameData.dealer + 1) % this.playerCount;
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
    if (playerData.hasPassed) {
      throw new Error(
        'Passing Error: player has already passed cards this round'
      );
    }
    for (const card of cards) {
      if (!playerData.hand.includes(card)) {
        throw new Error('Passing Error: player does not have that card');
      }
    }
    this.cardsPassedByPlayer.set(playerData.player, cards);
    playerData.hasPassed = true;

    let allPassed = true;
    for (const p of this.gameData.players) {
      if (!p.hasPassed) {
        allPassed = false;
        break;
      }
    }

    if (!allPassed) {
      return;
    }

    //remove cards from players and add to hand of who they were passing to
    for (const p of this.gameData.players) {
      const cards = this.cardsPassedByPlayer.get(p.player);
      let passedToPlayerData: HeartsPlayerData;
      switch (this.passDirection) {
        case HeartsPassDirection.LEFT:
          passedToPlayerData = this.gameData.players[
            (p.position + 1) % this.playerCount
          ];
          break;
        case HeartsPassDirection.RIGHT:
          passedToPlayerData = this.gameData.players[
            (p.position - 1) % this.playerCount
          ];
          break;
        case HeartsPassDirection.ACROSS:
          passedToPlayerData = this.gameData.players[
            (p.position + 2) % this.playerCount
          ];
          break;
        default:
          throw new Error('Pass cards error: unexepcted pass direction');
      }
      if (cards) {
        for (const card of cards) {
          this.removeCardFromPlayer(p, card);
          this.addCardToPlayer(passedToPlayerData, card);
        }
      } else {
        throw new Error(
          'Pass cards error: player not found in passed cards data'
        );
      }
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
    this.playedCards = new Map<Card, HeartsPlayer>();
    this.cardsPassedByPlayer = new Map<HeartsPlayer, Card[]>();
    //advance passing direction
    this.gameData.passDirection = nextPassDirection(this.passDirection);

    for (const p of this.gameData.players) {
      p.roundPoints = 0;
      p.hasPassed = false;
    }

    //deal the deck
    this.gameData.deck.shuffle();

    let dealTo = (this.gameData.dealer + 1) % this.playerCount;
    while (this.gameData.deck.drawPile.length) {
      const p = this.gameData.players[dealTo];
      this.addCardsToPlayer(p, this.gameData.deck.draw());

      dealTo = (dealTo + 1) % this.playerCount;
    }

    for (const p of this.gameData.players) {
      this.startingHandByPlayer.set(p.player, p.hand);
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

  public hasTwoOfClubs(playerData: HeartsPlayerData): boolean {
    for (const card of playerData.hand) {
      if (card.rank === two && card.suit === clubs) {
        return true;
      }
    }
    return false;
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
