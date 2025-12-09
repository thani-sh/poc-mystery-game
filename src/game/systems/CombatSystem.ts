import type { Character, CombatAction, TurnEntry } from "../types";
import { ActionType } from "../types";
import { GameState } from "./GameState";

/**
 * Combat system for managing turn-based tactical battles
 */
export class CombatSystem {
  private gameState: GameState;
  private turnOrder: TurnEntry[] = [];

  constructor() {
    this.gameState = GameState.getInstance();
  }

  /**
   * Initialize combat with all active characters
   */
  public initializeCombat(): void {
    this.gameState.startCombat();
    this.calculateTurnOrder();
  }

  /**
   * Calculate turn order based on character speed stats
   */
  private calculateTurnOrder(): void {
    const characters = this.gameState.getAliveCharacters();

    this.turnOrder = characters
      .map((char) => ({
        characterId: char.id,
        initiative: char.stats.speed + Math.random() * 10, // Add random factor
      }))
      .sort((a, b) => b.initiative - a.initiative); // Higher initiative goes first
  }

  /**
   * Get the current turn order
   */
  public getTurnOrder(): TurnEntry[] {
    return [...this.turnOrder];
  }

  /**
   * Get the character whose turn it currently is
   */
  public getCurrentTurnCharacter(): Character | undefined {
    const turnIndex = this.gameState.getCurrentTurnIndex();
    if (turnIndex >= this.turnOrder.length) {
      return undefined;
    }

    const entry = this.turnOrder[turnIndex];
    return this.gameState.getCharacter(entry.characterId);
  }

  /**
   * Advance to the next character's turn
   */
  public nextTurn(): void {
    this.gameState.nextTurn();

    // If we've gone through all characters, start a new round
    if (this.gameState.getCurrentTurnIndex() >= this.turnOrder.length) {
      this.gameState.resetTurns();
      this.calculateTurnOrder(); // Recalculate in case characters died
    }
  }

  /**
   * Execute a combat action
   */
  public async executeAction(action: CombatAction): Promise<boolean> {
    const actor = this.gameState.getCharacter(action.actorId);
    if (!actor) {
      return false;
    }

    switch (action.type) {
      case ActionType.Attack:
        return this.executeAttack(actor, action.targetId!);

      case ActionType.UseAbility:
        return this.executeAbility(actor, action.abilityId!, action.targetId);

      case ActionType.Wait:
        return true;

      default:
        return false;
    }
  }

  /**
   * Execute a basic attack
   */
  private executeAttack(attacker: Character, targetId: string): boolean {
    const target = this.gameState.getCharacter(targetId);
    if (!target) {
      return false;
    }

    // Basic damage calculation
    const damage = Math.max(
      1,
      attacker.stats.attack - target.stats.defense * 0.5,
    );
    const actualDamage = Math.floor(damage * (0.85 + Math.random() * 0.3)); // Add randomness

    // Apply damage
    const newHp = Math.max(0, target.stats.hp - actualDamage);
    this.gameState.updateCharacterStats(targetId, { hp: newHp });

    return true;
  }

  /**
   * Execute an ability
   */
  private executeAbility(
    caster: Character,
    abilityId: string,
    targetId?: string,
  ): boolean {
    const ability = caster.abilities.find((a) => a.id === abilityId);
    if (!ability) {
      return false;
    }

    // Check MP cost
    if (caster.stats.mp < ability.mpCost) {
      return false;
    }

    // Deduct MP
    const newMp = caster.stats.mp - ability.mpCost;
    this.gameState.updateCharacterStats(caster.id, { mp: newMp });

    // Apply ability effects
    if (targetId) {
      const target = this.gameState.getCharacter(targetId);
      if (!target) {
        return false;
      }

      // Damage
      if (ability.damage > 0) {
        const damage = Math.floor(
          ability.damage +
            caster.stats.attack * 0.5 -
            target.stats.defense * 0.3,
        );
        const actualDamage = Math.max(1, damage);
        const newHp = Math.max(0, target.stats.hp - actualDamage);
        this.gameState.updateCharacterStats(targetId, { hp: newHp });
      }

      // Healing
      if (ability.healing > 0) {
        const healing = Math.floor(ability.healing + caster.stats.attack * 0.3);
        const newHp = Math.min(target.stats.maxHp, target.stats.hp + healing);
        this.gameState.updateCharacterStats(targetId, { hp: newHp });
      }
    }

    return true;
  }

  /**
   * Check if combat should end (all enemies or all players defeated)
   */
  public checkCombatEnd(): { ended: boolean; playerVictory: boolean } {
    const aliveEnemies = this.gameState.getAliveEnemyCharacters();
    const alivePlayers = this.gameState.getAlivePlayerCharacters();

    if (aliveEnemies.length === 0) {
      return { ended: true, playerVictory: true };
    }

    if (alivePlayers.length === 0) {
      return { ended: true, playerVictory: false };
    }

    return { ended: false, playerVictory: false };
  }

  /**
   * End the combat
   */
  public endCombat(): void {
    this.gameState.endCombat();
    this.turnOrder = [];
  }

  /**
   * Calculate if an attack will hit (basic accuracy system)
   */
  public calculateHitChance(attacker: Character, target: Character): number {
    // Base 85% hit chance, modified by speed difference
    const speedDiff = attacker.stats.speed - target.stats.speed;
    const hitChance = 0.85 + speedDiff * 0.01;
    return Math.max(0.5, Math.min(0.99, hitChance)); // Clamp between 50% and 99%
  }

  /**
   * Calculate if an attack is a critical hit
   */
  public calculateCriticalHit(attacker: Character): boolean {
    const critChance = 0.05 + attacker.stats.speed * 0.001; // Base 5% + speed bonus
    return Math.random() < critChance;
  }
}
