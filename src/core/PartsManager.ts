import type { PartDefinition, PlayerPartsState } from '../types/parts'
import { PARTS_DATA } from '../data/partsData'

const STORAGE_KEY = 'shooting_game_parts_state'

export class PartsManager {
  private state: PlayerPartsState = {
    score: 0,
    bossCore: 0,
    equippedParts: {
      laser_cannon: 0,
      shield_generator: 0,
      booster: 0
    }
  }

  private readonly partsById: Map<string, PartDefinition> = new Map()

  constructor() {
    PARTS_DATA.forEach((part) => {
      this.partsById.set(part.id, part)
    })
    this.loadFromStorage()
  }

  getScore(): number {
    return this.state.score
  }

  getBossCore(): number {
    return this.state.bossCore
  }

  addScore(amount: number): void {
    this.state.score += amount
    this.saveToStorage()
  }

  addBossCore(amount: number): void {
    this.state.bossCore += amount
    this.saveToStorage()
  }

  getPartLevel(partId: string): number {
    return this.state.equippedParts[partId] ?? 0
  }

  getPartDefinition(partId: string): PartDefinition | undefined {
    return this.partsById.get(partId)
  }

  getAllParts(): PartDefinition[] {
    return PARTS_DATA
  }

  getCurrentStats(partId: string): Record<string, number> | null {
    const part = this.partsById.get(partId)
    if (!part) {
      return null
    }

    const currentLevel = this.getPartLevel(partId)
    const levelData = part.levels.find((lvl) => lvl.level === currentLevel)
    return levelData?.stats ?? null
  }

  canUpgrade(partId: string): boolean {
    const part = this.partsById.get(partId)
    if (!part) {
      return false
    }

    const currentLevel = this.getPartLevel(partId)
    const nextLevel = currentLevel + 1

    if (nextLevel >= part.levels.length) {
      return false
    }

    const nextLevelData = part.levels[nextLevel]
    if (!nextLevelData) {
      return false
    }

    return (
      this.state.score >= nextLevelData.price &&
      this.state.bossCore >= nextLevelData.bossCoreCost
    )
  }

  upgrade(partId: string): boolean {
    const part = this.partsById.get(partId)
    if (!part || !this.canUpgrade(partId)) {
      return false
    }

    const currentLevel = this.getPartLevel(partId)
    const nextLevel = currentLevel + 1
    const nextLevelData = part.levels[nextLevel]

    if (!nextLevelData) {
      return false
    }

    this.state.score -= nextLevelData.price
    this.state.bossCore -= nextLevelData.bossCoreCost
    this.state.equippedParts[partId] = nextLevel

    this.saveToStorage()
    return true
  }

  reset(): void {
    this.state = {
      score: 0,
      bossCore: 0,
      equippedParts: {
        laser_cannon: 0,
        shield_generator: 0,
        booster: 0
      }
    }
    this.saveToStorage()
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state))
    } catch (err) {
      console.warn('Failed to save parts state:', err)
    }
  }

  private loadFromStorage(): void {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        this.state = JSON.parse(saved)
      }
    } catch (err) {
      console.warn('Failed to load parts state:', err)
    }
  }

  dispose(): void {
    this.saveToStorage()
  }
}
