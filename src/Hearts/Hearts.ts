import {CardGame, GameState, PlayerData} from '../CardGame';
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
import {HeartsPlayer} from './HeartsPlayer';

export enum HeartsGamePhase {
  DEAL = 'Deal',
  PASS = 'Pass',
  PLAY = 'Play',
  SCORE = 'Score',
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

type HeartsRules = {
  players: number;
  queenBreaksHearts: boolean;
  passingCount: number;
};

interface HeartsPlayerData extends PlayerData {
  player: HeartsPlayer;
  roundPoints: number;
  totalPoints: number;
  hasPassed: boolean;
}

export class Hearts extends CardGame {
  private deck: Deck;
  protected playerCount = 4;
  protected playerData: HeartsPlayerData[] = [];

  private dealer = 0;
  private _rules: HeartsRules = {
    players: this.playerCount,
    queenBreaksHearts: false,
    passingCount: 3,
  };
  public get rules() {
    return this._rules;
  }

  private gamePhase: HeartsGamePhase;
  private passDirection: HeartsPassDirection;
  private currentPlayer = 0;
  private playerToLead = 0;
  private firstTurn = false;
  private heartsBroken = false;
  private playedCards: Map<Card, HeartsPlayer>;
  private startingHandByPlayer: Map<HeartsPlayer, Card[]>;
  private cardsPassedByPlayer: Map<HeartsPlayer, Card[]>;
  private currentTrick: Trick | null = null;

  public get gameInfo(): any {
    return [this._gameState, this.gamePhase, this.passDirection];
  }

  constructor(id: string) {
    super(id);
    this.deck = new StandardDeck();
    this.gamePhase = HeartsGamePhase.DEAL;
    this.passDirection = HeartsPassDirection.KEEP; //initialize to keep so starting a new phase advances it to Left
    this.playedCards = new Map<Card, HeartsPlayer>();
    this.startingHandByPlayer = new Map<HeartsPlayer, Card[]>();
    this.cardsPassedByPlayer = new Map<HeartsPlayer, Card[]>();
  }

  protected startGame(): void {
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
    const playerData = this.playerData[this.currentPlayer];
    if (playerData.player !== player) {
      throw new Error("Playing Error: Not this player's turn");
    }

    if (this.currentPlayer === this.playerToLead) {
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
    this.removeCardFromPlayer(this.playerData[this.currentPlayer], card);

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
    this.currentPlayer = (this.currentPlayer + 1) % this.playerCount;

    //resolve the trick
    if (this.currentTrick?.length === 4) {
      //get winner of trick
      const winningPlayer = this.playedCards.get(this.currentTrick.winner);
      if (!winningPlayer) {
        throw new Error('No winner found in this trick');
      }

      const winningPlayerData = this.findPlayerData(
        this.playerData,
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
        //finish the round
        let endGame = false;
        for (const p of this.playerData) {
          if (p.roundPoints === 26) {
            //shot the moon
            for (const pl of this.playerData) {
              if (pl !== p) {
                p.totalPoints += 26;
              }
            }
          } else {
            p.totalPoints += p.roundPoints;
          }

          if (p.totalPoints >= 100) {
            endGame = true;
          }
        }
        if (endGame) {
          this._gameState = GameState.FINISHED;
        } else {
          this.dealer = (this.dealer + 1) % this.playerCount;
          this.startNewRound();
        }
      }
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

    const playerData = this.findPlayerData(this.playerData, player);
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
    for (const p of this.playerData) {
      if (!p.hasPassed) {
        allPassed = false;
        break;
      }
    }

    if (!allPassed) {
      return;
    }

    //remove cards from players, add to who they're passing to
    for (const p of this.playerData) {
      const cards = this.cardsPassedByPlayer.get(p.player);
      let passedToPlayerData: HeartsPlayerData;
      switch (this.passDirection) {
        case HeartsPassDirection.LEFT:
          passedToPlayerData = this.playerData[
            (p.position + 1) % this.playerCount
          ];
          break;
        case HeartsPassDirection.RIGHT:
          passedToPlayerData = this.playerData[
            (p.position - 1) % this.playerCount
          ];
          break;
        case HeartsPassDirection.ACROSS:
          passedToPlayerData = this.playerData[
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
    this.gamePhase = HeartsGamePhase.PLAY;
  }

  private startNewTrick(playerData: HeartsPlayerData) {
    this.currentTrick = null;
    this.playerToLead = playerData.position;
    this.currentPlayer = this.playerToLead;
  }

  private startNewRound(): void {
    this.gamePhase = HeartsGamePhase.DEAL;
    this.playedCards = new Map<Card, HeartsPlayer>();
    this.cardsPassedByPlayer = new Map<HeartsPlayer, Card[]>();
    //advance passing direction
    this.passDirection = nextPassDirection(this.passDirection);

    for (const p of this.playerData) {
      p.roundPoints = 0;
      p.hasPassed = false;
    }

    //deal the deck
    this.deck.shuffle();

    let dealTo = (this.dealer + 1) % this.playerCount;
    while (this.deck.drawPile.length) {
      const p = this.playerData[dealTo];
      this.addCardsToPlayer(p, this.deck.draw());

      dealTo = (dealTo + 1) % this.playerCount;
    }

    for (const p of this.playerData) {
      this.startingHandByPlayer.set(p.player, p.hand);
    }

    //set flag for playing 2 of clubs and
    this.firstTurn = true;
    this.heartsBroken = false;

    //set phase to passing
    if (this.passDirection === HeartsPassDirection.KEEP) {
      this.startPlayingPhase();
    } else {
      this.gamePhase = HeartsGamePhase.PASS;
    }
  }

  private startPlayingPhase() {
    this.gamePhase = HeartsGamePhase.PLAY;
    this.startNewTrick(this.findTwoOfClubs());
  }
  private findTwoOfClubs(): HeartsPlayerData {
    for (const p of this.playerData) {
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
