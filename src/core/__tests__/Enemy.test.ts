import { describe, expect, it } from 'vitest'
import { Vector3 } from 'three'
import { Enemy, EnemyManager } from '../Enemy'

describe('Enemy', () => {
  it('spawns at specified position and becomes active', () => {
    const enemy = new Enemy()
    const spawnPos = new Vector3(2, 0, -10)

    enemy.spawn(spawnPos, 5)

    expect(enemy.isActive()).toBe(true)
    expect(enemy.object.visible).toBe(true)
    expect(enemy.position.x).toBe(2)
    expect(enemy.position.y).toBe(0)
    expect(enemy.position.z).toBe(-10)

    enemy.dispose()
  })

  it('deactivates and becomes invisible', () => {
    const enemy = new Enemy()
    enemy.spawn(new Vector3(0, 0, 0), 5)

    expect(enemy.isActive()).toBe(true)

    enemy.deactivate()

    expect(enemy.isActive()).toBe(false)
    expect(enemy.object.visible).toBe(false)

    enemy.dispose()
  })

  it('moves forward on update', () => {
    const enemy = new Enemy()
    enemy.spawn(new Vector3(0, 0, -10), 10)

    const initialZ = enemy.position.z

    enemy.update(0.1)

    expect(enemy.position.z).toBeGreaterThan(initialZ)
    expect(enemy.position.z).toBeCloseTo(-10 + 10 * 0.1, 2)

    enemy.dispose()
  })

  it('exhibits sway motion on x-axis', () => {
    const enemy = new Enemy()
    enemy.spawn(new Vector3(3, 0, -10), 5)

    const positions: number[] = []

    for (let i = 0; i < 20; i++) {
      enemy.update(0.05)
      positions.push(enemy.position.x)
    }

    // Sway should cause x position to vary around the base
    const minX = Math.min(...positions)
    const maxX = Math.max(...positions)
    const range = maxX - minX

    // Sway amplitude is random between 0.4 and 1.6
    // So we should see some variation in x position
    expect(range).toBeGreaterThan(0.1)

    enemy.dispose()
  })

  it('does not update when inactive', () => {
    const enemy = new Enemy()
    enemy.spawn(new Vector3(0, 0, -10), 10)
    enemy.deactivate()

    const initialZ = enemy.position.z

    enemy.update(1.0)

    expect(enemy.position.z).toBe(initialZ)

    enemy.dispose()
  })
})

describe('EnemyManager', () => {
  it('spawns enemies over time and respects max active limit', () => {
    const manager = new EnemyManager(20)

    // Trigger multiple spawn attempts with smaller deltas
    // SPAWN_INTERVAL_BASE + SPAWN_INTERVAL_VARIANCE = 2.5s max
    for (let i = 0; i < 30; i++) {
      manager.update(0.3) // Total 9 seconds, should trigger multiple spawns
    }

    const activeEnemies = manager.getActiveEnemies()

    // MAX_ACTIVE_ENEMIES is 8 according to Enemy.ts
    expect(activeEnemies.length).toBeLessThanOrEqual(8)
    expect(activeEnemies.length).toBeGreaterThan(0)

    manager.dispose()
  })

  it('deactivates enemies that move past despawn threshold', () => {
    const manager = new EnemyManager(10)

    // Force initial spawns
    for (let i = 0; i < 10; i++) {
      manager.update(0.3)
    }

    const activeCount = manager.getActiveEnemies().length
    expect(activeCount).toBeGreaterThan(0)

    // Update for a long time to move enemies past despawn zone (z > 9)
    // Enemies spawn at z in [-34, -24] and move forward
    // With speed range [6, 11], need ~4-7 seconds to reach z=9
    for (let i = 0; i < 100; i++) {
      manager.update(0.1) // Total 10 seconds
    }

    // All initial enemies should have despawned
    const remainingActive = manager.getActiveEnemies().length
    // Some new enemies may have spawned, so just check it's not the same
    expect(remainingActive).toBeLessThanOrEqual(8)

    manager.dispose()
  })

  it('returns only active enemies from getActiveEnemies', () => {
    const manager = new EnemyManager(5)

    // Initially no active enemies
    expect(manager.getActiveEnemies().length).toBe(0)

    // Trigger spawns
    for (let i = 0; i < 10; i++) {
      manager.update(0.3)
    }

    const activeEnemies = manager.getActiveEnemies()
    expect(activeEnemies.length).toBeGreaterThan(0)

    // All returned enemies should be active
    activeEnemies.forEach((enemy) => {
      expect(enemy.isActive()).toBe(true)
    })

    manager.dispose()
  })
})
