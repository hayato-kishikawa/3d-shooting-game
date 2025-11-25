import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Vector3 } from 'three'
import { Boss } from '../Boss'

describe('Boss', () => {
  let boss: Boss

  beforeEach(() => {
    boss = new Boss()
  })

  afterEach(() => {
    boss.dispose()
  })

  describe('spawn', () => {
    it('activates the boss at the given position with HP', () => {
      const position = new Vector3(0, 0, -20)
      const hp = 50

      boss.spawn(position, hp)

      expect(boss.isActive()).toBe(true)
      expect(boss.currentHP).toBe(50)
      expect(boss.maxHitPoints).toBe(50)
      expect(boss.object.visible).toBe(true)
      expect(boss.position.z).toBe(-20)
    })

    it('accepts optional fire callback', () => {
      const position = new Vector3(0, 0, -20)
      const onFire = vi.fn()

      boss.spawn(position, 50, onFire)

      expect(boss.isActive()).toBe(true)
    })
  })

  describe('update', () => {
    it('does not update when inactive', () => {
      const initialPosition = boss.position.clone()

      boss.update(1.0)

      expect(boss.position).toEqual(initialPosition)
    })

    it('performs left-right sway motion when active', () => {
      const position = new Vector3(0, 0, -20)
      boss.spawn(position, 50)

      const initialX = boss.position.x

      // Update over time to see sway
      boss.update(0.5)
      const midX = boss.position.x

      // Position should change due to sway
      expect(midX).not.toBe(initialX)
    })

    it('fires at player position after cooldown', () => {
      const onFire = vi.fn()
      boss.spawn(new Vector3(0, 0, -20), 50, onFire)

      const playerPosition = new Vector3(2, 0, 5)

      // Should not fire immediately
      boss.update(0.1, playerPosition)
      expect(onFire).not.toHaveBeenCalled()

      // Should fire after cooldown (1.8s)
      boss.update(2.0, playerPosition)
      expect(onFire).toHaveBeenCalled()
    })
  })

  describe('takeDamage', () => {
    beforeEach(() => {
      boss.spawn(new Vector3(0, 0, -20), 50)
    })

    it('reduces HP by damage amount', () => {
      boss.takeDamage(10)

      expect(boss.currentHP).toBe(40)
      expect(boss.isActive()).toBe(true)
    })

    it('does not reduce HP below zero', () => {
      boss.takeDamage(60)

      expect(boss.currentHP).toBe(0)
    })

    it('returns true and deactivates when HP reaches zero', () => {
      const defeated = boss.takeDamage(50)

      expect(defeated).toBe(true)
      expect(boss.isActive()).toBe(false)
      expect(boss.object.visible).toBe(false)
    })

    it('returns false when damage does not defeat boss', () => {
      const defeated = boss.takeDamage(10)

      expect(defeated).toBe(false)
      expect(boss.isActive()).toBe(true)
    })

    it('returns false when boss is already inactive', () => {
      boss.deactivate()

      const defeated = boss.takeDamage(10)

      expect(defeated).toBe(false)
    })
  })

  describe('deactivate', () => {
    it('makes boss inactive and invisible', () => {
      boss.spawn(new Vector3(0, 0, -20), 50)

      boss.deactivate()

      expect(boss.isActive()).toBe(false)
      expect(boss.object.visible).toBe(false)
    })

    it('is safe to call multiple times', () => {
      boss.spawn(new Vector3(0, 0, -20), 50)

      boss.deactivate()
      boss.deactivate()

      expect(boss.isActive()).toBe(false)
    })
  })

  describe('position', () => {
    it('returns the boss object position', () => {
      boss.spawn(new Vector3(5, 2, -10), 50)

      expect(boss.position.x).toBe(5)
      expect(boss.position.y).toBe(2)
      expect(boss.position.z).toBe(-10)
    })
  })
})
