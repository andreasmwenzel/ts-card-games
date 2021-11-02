import {
  Suit,
  Card,
  Deck,
  StandardDeck,
  two,
  clubs,
  queen,
  spades,
  hearts,
  Rank,
} from 'ts-cards';
import {v4 as uuidv4} from 'uuid';
import {CardGame} from '..';
import {CardGameTrick} from '../mechanics/CardGameTrick';
import {GameState} from '../types';
import {HeartsPlayer} from './HeartsPlayer';
import {
  HeartsGameData,
  HeartsGameInfo,
  HeartsGamePhase,
  HeartsPassDirection,
  HeartsPlayerData,
  HeartsPlayerInfo,
} from './types';
import {nextPassDirection} from './utils';

export class Hearts extends CardGame {
  protected gameData: HeartsGameData;
  private currentTrick: CardGameTrick<HeartsPlayerData> | null = null;

  constructor(id?: string, data?: HeartsGameData) {
    super(id, data);

    if (data) {
      this.gameData = data;
      let p = this.gameData.round.positionToLead;
      while (p !== this.gameData.round.positionToPlay) {
        const pData = this.gameData.players[p];
        if (!this.currentTrick) {
          this.currentTrick = new CardGameTrick(
            pData,
            pData.round.cardsPlayed.slice(-1)[0]
          );
        } else {
          this.currentTrick.addCardToTrick(
            pData,
            pData.round.cardsPlayed.slice(-1)[0]
          );
        }
        p = p + 1;
      }
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
          playTo: 100,
        },
        dealer: 0,
        round: {
          positionToPlay: 0,
          positionToLead: 0,
          firstTrick: true,
          heartsBroken: false,
        },
      };
    }
  }

  public get rules() {
    return this.gameData.rules;
  }
  public get gameInfo(): HeartsGameInfo {
    const info = {
      id: this.gameData.id,
      gameState: this.gameData.gameState,
      gamePhase: this.gameData.gamePhase,
      passDirection: this.passDirection,
      players: new Array<HeartsPlayerInfo>(),
      rules: this.gameData.rules,
      round: this.gameData.round,
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
  public get deck(): Readonly<Deck> {
    return this.gameData.deck;
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
    const pos = super.addPlayer(player, position);
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
    return pos;
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
    const playerData = this.gameData.players[
      this.gameData.round.positionToPlay
    ];
    if (playerData.player !== player) {
      throw new Error("Playing Error: Not this player's turn");
    }

    if (!playerData.hand.includes(card)) {
      throw new Error('Playing Error: player does not have that card');
    }

    if (
      this.gameData.round.positionToPlay === this.gameData.round.positionToLead
    ) {
      if (this.gameData.round.firstTrick) {
        //first card played every round must be the two of clubs `
        if (!(card.suit === clubs && card.rank === two)) {
          throw new Error('Playing Error: first card must be a two of clubs');
        }
      }
      if (
        !this.gameData.round.heartsBroken &&
        card.suit === hearts &&
        !this.hasOnlyHearts(playerData)
      ) {
        //can't play hearts unless player has no other cards
        throw new Error('Playing Error: Hearts has not been broken');
      }
      this.currentTrick = new CardGameTrick(playerData, card);
    } else {
      //check if player has any of leading suit
      if (!this.currentTrick) {
        throw new Error('Play error: no trick fround');
      }
      if (card.suit !== this.currentTrick.suit) {
        if (this.hasSuit(playerData, this.currentTrick.suit)) {
          throw new Error('Playing Error: Must Follow Suit');
        }
      }
      if (this.gameData.round.firstTrick) {
        //points played on first trick
        if (this.cardPoints(card) > 0 && !this.hasOnlyPoints(playerData)) {
          throw new Error('Playing Error: Cannot play points of first trick');
        }
      }
      this.currentTrick.addCardToTrick(playerData, card);
    }

    playerData.round.cardsPlayed.push(card);
    this.removeCardFromPlayer(playerData, card);

    if (card.suit === hearts) {
      this.gameData.round.heartsBroken = true;
    }
    if (
      this.rules.queenBreaksHearts &&
      card.rank === queen &&
      card.suit === spades
    ) {
      this.gameData.round.heartsBroken = true;
    }

    //resolve the trick
    if (this.currentTrick.length === this.gameData.rules.players) {
      if (this.gameData.round.firstTrick) {
        this.gameData.round.firstTrick = false;
      }
      //get winner of trick
      const winningPlayerData = this.currentTrick.winnningPlayerData;
      if (!winningPlayerData) {
        throw new Error('No winner found in this trick');
      }

      this.gameData.round.positionToLead = winningPlayerData.position;
      for (const card of this.currentTrick.cards) {
        winningPlayerData.round.cardsTaken.push(card);
        winningPlayerData.round.points += this.cardPoints(card);
      }
      //if player still has cards, start a new trick
      if (winningPlayerData.hand.length > 0) {
        this.startNewTrick(winningPlayerData);
      } else {
        this.scoreRound();
      }
    } else {
      //advance current player
      this.gameData.round.positionToPlay =
        (this.gameData.round.positionToPlay + 1) % this.gameData.rules.players;
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
        break;
      }
    }
    for (const p of this.gameData.players) {
      p.score.push(p.round.points);
      const totalScore = p.score.reduce((a, b) => a + b, 0);
      if (totalScore >= this.gameData.rules.playTo) {
        endGame = true;
      }
    }
    if (endGame) {
      this.gameData.gameState = GameState.FINISHED;
    } else {
      this.gameData.dealer =
        (this.gameData.dealer + 1) % this.gameData.rules.players;
      this.gameData.gamePhase = HeartsGamePhase.DEAL;
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
            (((p.position - 1) % this.gameData.rules.players) +
              this.gameData.rules.players) %
              this.gameData.rules.players
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
    this.startPlayingPhase();
  }

  private startNewTrick(playerData: HeartsPlayerData) {
    this.currentTrick = null;
    this.gameData.round.positionToLead = playerData.position;
    this.gameData.round.positionToPlay = this.gameData.round.positionToLead;
  }

  public startNewRound(): void {
    if (this.gamePhase !== HeartsGamePhase.DEAL) {
      throw new Error('New Round Error: Not in the right Gamephase');
    }
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

    //set flag for first trick and hearts broken
    this.gameData.round = {
      firstTrick: true,
      heartsBroken: false,
      positionToLead: 0,
      positionToPlay: 0,
    };

    //set phase to passing
    if (this.passDirection === HeartsPassDirection.KEEP) {
      this.startPlayingPhase();
    } else {
      this.gameData.gamePhase = HeartsGamePhase.PASS;
    }
  }

  private startPlayingPhase() {
    this.gameData.gamePhase = HeartsGamePhase.PLAY;
    this.gameData.round.firstTrick = true;
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

  public cardPoints(card: Card): number {
    if (card.suit === hearts) {
      return 1;
    }
    if (card.suit === spades && card.rank === queen) {
      return 13;
    }
    return 0;
  }

  private hasCard(
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
  private hasTwoOfClubs(playerData: HeartsPlayerData): boolean {
    return this.hasCard(playerData, two, clubs);
  }
  private hasSuit(playerData: HeartsPlayerData, suit: Suit): boolean {
    for (const card of playerData.hand) {
      if (card.suit === suit) {
        return true;
      }
    }
    return false;
  }
  private hasOnlyHearts(playerData: HeartsPlayerData): boolean {
    for (const card of playerData.hand) {
      if (card.suit !== hearts) {
        return false;
      }
    }
    return true;
  }
  private hasOnlyPoints(playerData: HeartsPlayerData): boolean {
    for (const card of playerData.hand) {
      if (this.cardPoints(card) === 0) {
        return false;
      }
    }
    return true;
  }

  public getPlayerData(player: HeartsPlayer): Readonly<HeartsPlayerData> {
    return this.findPlayerData(this.gameData.players, player);
  }
}
