import { Vector3 } from 'three'
import type { Bullet } from './Bullet'
import type { Enemy } from './Enemy'
import type { Player } from './Player'

const BULLET_RADIUS = 0.15
const ENEMY_RADIUS = 1.0
const PLAYER_RADIUS = 1.0

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
 */
export function checkPlayerEnemyCollision(
  player: Player,
  enemies: readonly Enemy[]
): boolean {
  for (const enemy of enemies) {
    if (!enemy.isActive()) {
      continue
    }

    if (sphereIntersects(player.position, PLAYER_RADIUS, enemy.position, ENEMY_RADIUS)) {
      return true
    }
  }

  return false
}
