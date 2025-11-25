import { describe, it, expect } from 'vitest'
import { Vector3 } from 'three'
import { Bullet } from '../Bullet'
import { Enemy } from '../Enemy'
import { Player } from '../Player'
import { PartsManager } from '../PartsManager'
import { checkBulletEnemyCollisions, checkPlayerEnemyCollision } from '../Collision'

describe('Collision', () => {
  describe('checkBulletEnemyCollisions', () => {
    it('detects collision when bullet and enemy overlap', () => {
      const bullet = new Bullet()
      bullet.fire(new Vector3(0, 0, 0), new Vector3(0, 0, 1))

      const enemy = new Enemy()
      enemy.spawn(new Vector3(0, 0, 0.5), 5)

      const hits = checkBulletEnemyCollisions([bullet], [enemy])

      expect(hits.length).toBe(1)
      expect(hits[0]!.bullet).toBe(bullet)
      expect(hits[0]!.enemy).toBe(enemy)
    })

    it('returns empty array when bullet and enemy are far apart', () => {
      const bullet = new Bullet()
      bullet.fire(new Vector3(0, 0, 0), new Vector3(0, 0, 1))

      const enemy = new Enemy()
      enemy.spawn(new Vector3(10, 0, 10), 5)

      const hits = checkBulletEnemyCollisions([bullet], [enemy])

      expect(hits.length).toBe(0)
    })

    it('skips inactive bullets', () => {
      const bullet = new Bullet()
      bullet.fire(new Vector3(0, 0, 0), new Vector3(0, 0, 1))
      bullet.deactivate()

      const enemy = new Enemy()
      enemy.spawn(new Vector3(0, 0, 0), 5)

      const hits = checkBulletEnemyCollisions([bullet], [enemy])

      expect(hits.length).toBe(0)
    })

    it('skips inactive enemies', () => {
      const bullet = new Bullet()
      bullet.fire(new Vector3(0, 0, 0), new Vector3(0, 0, 1))

      const enemy = new Enemy()
      enemy.spawn(new Vector3(0, 0, 0), 5)
      enemy.deactivate()

      const hits = checkBulletEnemyCollisions([bullet], [enemy])

      expect(hits.length).toBe(0)
    })

    it('detects multiple collisions', () => {
      const bullet1 = new Bullet()
      bullet1.fire(new Vector3(0, 0, 0), new Vector3(0, 0, 1))

      const bullet2 = new Bullet()
      bullet2.fire(new Vector3(2, 0, 0), new Vector3(0, 0, 1))

      const enemy1 = new Enemy()
      enemy1.spawn(new Vector3(0, 0, 0.5), 5)

      const enemy2 = new Enemy()
      enemy2.spawn(new Vector3(2, 0, 0.5), 5)

      const hits = checkBulletEnemyCollisions([bullet1, bullet2], [enemy1, enemy2])

      expect(hits.length).toBe(2)
    })

    it('handles boundary case at exact collision radius', () => {
      const bullet = new Bullet()
      bullet.fire(new Vector3(0, 0, 0), new Vector3(0, 0, 1))

      const enemy = new Enemy()
      // Bullet radius ~0.15, Enemy radius ~1.0, sum ~1.15
      enemy.spawn(new Vector3(1.15, 0, 0), 5)

      const hits = checkBulletEnemyCollisions([bullet], [enemy])

      expect(hits.length).toBe(1)
    })
  })

  describe('checkPlayerEnemyCollision', () => {
    it('returns enemy when player and enemy overlap', () => {
      const partsManager = new PartsManager()
      partsManager.reset()

      const container = document.createElement('div')
      const player = new Player({
        camera: { fov: 75, aspect: 1, near: 0.1, far: 1000 } as any,
        inputElement: container,
        partsManager
      })

      player.object.position.set(0, 0, 0)

      const enemy = new Enemy()
      enemy.spawn(new Vector3(0.5, 0, 0), 5)

      const result = checkPlayerEnemyCollision(player, [enemy])

      expect(result).toBe(enemy)

      player.dispose()
    })

    it('returns null when player and enemy are far apart', () => {
      const partsManager = new PartsManager()
      partsManager.reset()

      const container = document.createElement('div')
      const player = new Player({
        camera: { fov: 75, aspect: 1, near: 0.1, far: 1000 } as any,
        inputElement: container,
        partsManager
      })

      player.object.position.set(0, 0, 0)

      const enemy = new Enemy()
      enemy.spawn(new Vector3(10, 0, 10), 5)

      const result = checkPlayerEnemyCollision(player, [enemy])

      expect(result).toBeNull()

      player.dispose()
    })

    it('returns null when all enemies are inactive', () => {
      const partsManager = new PartsManager()
      partsManager.reset()

      const container = document.createElement('div')
      const player = new Player({
        camera: { fov: 75, aspect: 1, near: 0.1, far: 1000 } as any,
        inputElement: container,
        partsManager
      })

      player.object.position.set(0, 0, 0)

      const enemy = new Enemy()
      enemy.spawn(new Vector3(0, 0, 0), 5)
      enemy.deactivate()

      const result = checkPlayerEnemyCollision(player, [enemy])

      expect(result).toBeNull()

      player.dispose()
    })

    it('returns first colliding enemy when multiple enemies present', () => {
      const partsManager = new PartsManager()
      partsManager.reset()

      const container = document.createElement('div')
      const player = new Player({
        camera: { fov: 75, aspect: 1, near: 0.1, far: 1000 } as any,
        inputElement: container,
        partsManager
      })

      player.object.position.set(0, 0, 0)

      const enemy1 = new Enemy()
      enemy1.spawn(new Vector3(0.3, 0, 0), 5)

      const enemy2 = new Enemy()
      enemy2.spawn(new Vector3(10, 0, 0), 5)

      const result = checkPlayerEnemyCollision(player, [enemy1, enemy2])

      expect(result).toBe(enemy1)

      player.dispose()
    })
  })
})
