import type { Character, GameMap } from "../types";

/**
 * Central game state manager
 * Manages the current state of the game including characters, maps, and progression
 */
export class GameState {
  private static instance: GameState;

  /** All characters in the game (player party and enemies) */
  private characters: Map<string, Character> = new Map();

  /** Current active map */
  private currentMap: GameMap | null = null;

  /** Player party character IDs */
  private party: string[] = [];

  /** Current turn index in combat */
  private currentTurnIndex = 0;

  /** Whether the game is in combat mode */
  private inCombat = false;

  private constructor() {
    // Private constructor for singleton
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): GameState {
    if (!GameState.instance) {
      GameState.instance = new GameState();
    }
    return GameState.instance;
  }

  /**
   * Initialize game state with starting data
   */
  public initialize(): void {
    this.characters.clear();
    this.party = [];
    this.currentMap = null;
    this.currentTurnIndex = 0;
    this.inCombat = false;
  }

  /**
   * Add a character to the game
   */
  public addCharacter(character: Character): void {
    this.characters.set(character.id, character);
  }

  /**
   * Get a character by ID
   */
  public getCharacter(id: string): Character | undefined {
    return this.characters.get(id);
  }

  /**
   * Get all characters
   */
  public getAllCharacters(): Character[] {
    return Array.from(this.characters.values());
  }

  /**
   * Remove a character from the game
   */
  public removeCharacter(id: string): void {
    this.characters.delete(id);
    this.party = this.party.filter((charId) => charId !== id);
  }

  /**
   * Add a character to the player's party
   */
  public addToParty(characterId: string): void {
    if (this.characters.has(characterId) && !this.party.includes(characterId)) {
      this.party.push(characterId);
    }
  }

  /**
   * Get the player's party characters
   */
  public getParty(): Character[] {
    return this.party
      .map((id) => this.characters.get(id))
      .filter((char): char is Character => char !== undefined);
  }

  /**
   * Set the current map
   */
  public setCurrentMap(map: GameMap): void {
    this.currentMap = map;
  }

  /**
   * Get the current map
   */
  public getCurrentMap(): GameMap | null {
    return this.currentMap;
  }

  /**
   * Start combat mode
   */
  public startCombat(): void {
    this.inCombat = true;
    this.currentTurnIndex = 0;
  }

  /**
   * End combat mode
   */
  public endCombat(): void {
    this.inCombat = false;
  }

  /**
   * Check if in combat
   */
  public isInCombat(): boolean {
    return this.inCombat;
  }

  /**
   * Get the current turn index
   */
  public getCurrentTurnIndex(): number {
    return this.currentTurnIndex;
  }

  /**
   * Advance to next turn
   */
  public nextTurn(): void {
    this.currentTurnIndex++;
  }

  /**
   * Reset turn counter
   */
  public resetTurns(): void {
    this.currentTurnIndex = 0;
  }

  /**
   * Update a character's position
   */
  public updateCharacterPosition(
    characterId: string,
    x: number,
    y: number,
  ): void {
    const character = this.characters.get(characterId);
    if (character) {
      character.position = { x, y };
    }
  }

  /**
   * Update character stats (e.g., after taking damage)
   */
  public updateCharacterStats(
    characterId: string,
    stats: Partial<Character["stats"]>,
  ): void {
    const character = this.characters.get(characterId);
    if (character) {
      Object.assign(character.stats, stats);
    }
  }

  /**
   * Check if a character is defeated (HP <= 0)
   */
  public isCharacterDefeated(characterId: string): boolean {
    const character = this.characters.get(characterId);
    return character ? character.stats.hp <= 0 : false;
  }

  /**
   * Get all alive characters
   */
  public getAliveCharacters(): Character[] {
    return this.getAllCharacters().filter((char) => char.stats.hp > 0);
  }

  /**
   * Get all alive player characters
   */
  public getAlivePlayerCharacters(): Character[] {
    return this.getAllCharacters().filter(
      (char) => char.isPlayer && char.stats.hp > 0,
    );
  }

  /**
   * Get all alive enemy characters
   */
  public getAliveEnemyCharacters(): Character[] {
    return this.getAllCharacters().filter(
      (char) => !char.isPlayer && char.stats.hp > 0,
    );
  }
}
