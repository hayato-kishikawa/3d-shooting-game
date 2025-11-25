export type PartCategory = 'weapon' | 'defense' | 'mobility' | 'special'

export interface PartLevel {
  level: number
  price: number
  bossCoreCost: number
  stats: Record<string, number>
  description: string
}

export interface PartDefinition {
  id: string
  name: string
  nameJP: string
  category: PartCategory
  description: string
  levels: PartLevel[]
}

export interface PlayerPartsState {
  score: number
  bossCore: number
  equippedParts: Record<string, number> // partId -> level
}
