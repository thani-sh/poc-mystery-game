import type { Character, GameMap, Clue } from "../types";

/**
 * Central game state manager
 * Manages the current state of the game including characters, maps, clues, and progression
 */
export class GameState {
  private static instance: GameState;

  /** All characters in the game (player and NPCs) */
  private characters: Map<string, Character> = new Map();

  /** Current active map */
  private currentMap: GameMap | null = null;

  /** Player character ID */
  private playerId: string | null = null;

  /** Collected clues */
  private collectedClues: Set<string> = new Set();

  /** All clues in the game */
  private clues: Map<string, Clue> = new Map();

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
    this.playerId = null;
    this.currentMap = null;
    this.collectedClues.clear();
    this.clues.clear();
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
  }

  /**
   * Set the player character
   */
  public setPlayer(characterId: string): void {
    if (this.characters.has(characterId)) {
      this.playerId = characterId;
    }
  }

  /**
   * Get the player character
   */
  public getPlayer(): Character | undefined {
    return this.playerId ? this.characters.get(this.playerId) : undefined;
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
   * Add a clue to the game
   */
  public addClue(clue: Clue): void {
    this.clues.set(clue.id, clue);
  }

  /**
   * Collect a clue
   */
  public collectClue(clueId: string): boolean {
    if (this.clues.has(clueId) && !this.collectedClues.has(clueId)) {
      this.collectedClues.add(clueId);
      return true;
    }
    return false;
  }

  /**
   * Check if a clue has been collected
   */
  public hasClue(clueId: string): boolean {
    return this.collectedClues.has(clueId);
  }

  /**
   * Get all collected clues
   */
  public getCollectedClues(): Clue[] {
    return Array.from(this.collectedClues)
      .map((id) => this.clues.get(id))
      .filter((clue): clue is Clue => clue !== undefined);
  }

  /**
   * Get a clue by ID
   */
  public getClue(clueId: string): Clue | undefined {
    return this.clues.get(clueId);
  }

  /**
   * Get all NPCs (non-player characters)
   */
  public getNPCs(): Character[] {
    return this.getAllCharacters().filter((char) => !char.isPlayer);
  }
}
