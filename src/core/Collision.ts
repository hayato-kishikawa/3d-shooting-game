import { Vector3 } from 'three'
import type { Bullet } from './Bullet'
import type { Enemy } from './Enemy'
import type { Player } from './Player'
import type { Boss } from './Boss'
import type { BossBullet } from './BossBullet'

const BULLET_RADIUS = 0.15
const ENEMY_RADIUS = 1.0
const PLAYER_RADIUS = 1.0
const BOSS_RADIUS = 3.0

export interface BulletHit {
  bullet: Bullet
  enemy: Enemy
}

/**
 * Sphere-sphere collision detection
 */
function sphereIntersects(
  pos1: Vector3,
  radius1: number,
  pos2: Vector3,
  radius2: number
): boolean {
  const dx = pos1.x - pos2.x
  const dy = pos1.y - pos2.y
  const dz = pos1.z - pos2.z
  const distSq = dx * dx + dy * dy + dz * dz
  const radiusSum = radius1 + radius2
  return distSq <= radiusSum * radiusSum
}

/**
 * Check collisions between bullets and enemies
 * Returns array of hits (bullet + enemy pairs)
 */
export function checkBulletEnemyCollisions(
  bullets: readonly Bullet[],
  enemies: readonly Enemy[]
): BulletHit[] {
  const hits: BulletHit[] = []

  for (const bullet of bullets) {
    if (!bullet.isActive()) {
      continue
    }

    for (const enemy of enemies) {
      if (!enemy.isActive()) {
        continue
      }

      if (sphereIntersects(bullet.mesh.position, BULLET_RADIUS, enemy.position, ENEMY_RADIUS)) {
        hits.push({ bullet, enemy })
      }
    }
  }

  return hits
}

/**
 * Check if player collides with any active enemy
 * Returns the first enemy that collides, or null if none
 */
export function checkPlayerEnemyCollision(
  player: Player,
  enemies: readonly Enemy[]
): Enemy | null {
  for (const enemy of enemies) {
    if (!enemy.isActive()) {
      continue
    }

    if (sphereIntersects(player.position, PLAYER_RADIUS, enemy.position, ENEMY_RADIUS)) {
      return enemy
    }
  }

  return null
}

/**
 * Check if player bullets collide with boss
 * Returns array of bullets that hit the boss
 */
export function checkBulletBossCollisions(
  bullets: readonly Bullet[],
  boss: Boss
): Bullet[] {
  if (!boss.isActive()) {
    return []
  }

  const hits: Bullet[] = []

  for (const bullet of bullets) {
    if (!bullet.isActive()) {
      continue
    }

    if (sphereIntersects(bullet.mesh.position, BULLET_RADIUS, boss.position, BOSS_RADIUS)) {
      hits.push(bullet)
    }
  }

  return hits
}

/**
 * Check if boss bullets collide with player
 * Returns the first boss bullet that collides, or null if none
 */
export function checkBossBulletPlayerCollision(
  bossBullets: readonly BossBullet[],
  player: Player
): BossBullet | null {
  for (const bullet of bossBullets) {
    if (!bullet.isActive()) {
      continue
    }

    if (sphereIntersects(bullet.mesh.position, BULLET_RADIUS, player.position, PLAYER_RADIUS)) {
      return bullet
    }
  }

  return null
}
