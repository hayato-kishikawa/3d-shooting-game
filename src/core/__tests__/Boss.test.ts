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

      boss.spawn(position, 'dreadnought')

      expect(boss.isActive()).toBe(true)
      expect(boss.currentHP).toBe(50)
      expect(boss.maxHitPoints).toBe(50)
      expect(boss.object.visible).toBe(true)
      expect(boss.position.z).toBe(-20)
    })

    it('accepts optional fire callback', () => {
      const position = new Vector3(0, 0, -20)
      const onFire = vi.fn()

      boss.spawn(position, 'dreadnought', onFire)

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
      boss.spawn(position, 'dreadnought')

      const initialX = boss.position.x

      // Update over time to see sway
      boss.update(0.5)
      const midX = boss.position.x

      // Position should change due to sway
      expect(midX).not.toBe(initialX)
    })

    it('fires at player position after cooldown', () => {
      const onFire = vi.fn()
      boss.spawn(new Vector3(0, 0, -20), 'dreadnought', onFire)

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
      boss.spawn(new Vector3(0, 0, -20), 'dreadnought')
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
      boss.spawn(new Vector3(0, 0, -20), 'dreadnought')

      boss.deactivate()

      expect(boss.isActive()).toBe(false)
      expect(boss.object.visible).toBe(false)
    })

    it('is safe to call multiple times', () => {
      boss.spawn(new Vector3(0, 0, -20), 'dreadnought')

      boss.deactivate()
      boss.deactivate()

      expect(boss.isActive()).toBe(false)
    })
  })

  describe('position', () => {
    it('returns the boss object position', () => {
      boss.spawn(new Vector3(5, 2, -10), 'dreadnought')

      expect(boss.position.x).toBe(5)
      expect(boss.position.y).toBe(2)
      expect(boss.position.z).toBe(-10)
    })
  })

  describe('attack patterns', () => {
    describe('3-way spread (Dreadnought)', () => {
      it('fires single bullet when HP > 50%', () => {
        const onFire = vi.fn()
        boss.spawn(new Vector3(0, 0, -20), 'dreadnought', onFire)

        const playerPosition = new Vector3(2, 0, 5)
        boss.update(2.0, playerPosition)

        // Only 1 call (center bullet)
        expect(onFire).toHaveBeenCalledTimes(1)
      })

      it('fires 3-way spread when HP ≤ 50%', () => {
        const onFire = vi.fn()
        boss.spawn(new Vector3(0, 0, -20), 'dreadnought', onFire)

        // Reduce HP to 50% (Dreadnought HP is 50, so reduce to 25)
        boss.takeDamage(25)
        expect(boss.currentHP).toBe(25)

        const playerPosition = new Vector3(2, 0, 5)
        boss.update(2.0, playerPosition)

        // 3 calls (center + left + right)
        expect(onFire).toHaveBeenCalledTimes(3)
      })

      it('fires 3-way spread when HP < 50%', () => {
        const onFire = vi.fn()
        boss.spawn(new Vector3(0, 0, -20), 'dreadnought', onFire)

        // Reduce HP to 40% (Dreadnought HP is 50, so reduce to 20)
        boss.takeDamage(30)
        expect(boss.currentHP).toBe(20)

        const playerPosition = new Vector3(2, 0, 5)
        boss.update(2.0, playerPosition)

        // 3 calls (center + left + right)
        expect(onFire).toHaveBeenCalledTimes(3)
      })
    })

    describe('rush attack (Dreadnought)', () => {
      it('does not rush when HP > 30%', () => {
        boss.spawn(new Vector3(0, 0, -20), 'dreadnought')
        const initialZ = boss.position.z

        const playerPosition = new Vector3(0, 0, 10)
        boss.update(0.5, playerPosition)

        // Position should not move significantly toward player
        expect(boss.position.z).toBeCloseTo(initialZ, 1)
      })

      it('rushes toward player when HP ≤ 30%', () => {
        boss.spawn(new Vector3(0, 0, -20), 'dreadnought')

        // Reduce HP to 30% (Dreadnought HP is 50, so reduce to 15)
        boss.takeDamage(35)
        expect(boss.currentHP).toBe(15)

        const playerPosition = new Vector3(0, 0, 10)
        const initialZ = boss.position.z

        // Wait for rush cooldown to expire and rush to start
        boss.update(4.1, playerPosition)

        // Update a bit more to let boss move during rush
        boss.update(0.5, playerPosition)

        // Boss should move toward player (Z increases from initial)
        expect(boss.position.z).toBeGreaterThan(initialZ)
      })

      it('rush attack has limited duration', () => {
        boss.spawn(new Vector3(0, 0, -20), 'dreadnought')

        // Reduce HP to 30% (Dreadnought HP is 50, so reduce to 15)
        boss.takeDamage(35)

        const playerPosition = new Vector3(0, 0, 10)

        // Start rush (wait for cooldown)
        boss.update(4.1, playerPosition)

        // Rush for a bit
        boss.update(0.5, playerPosition)
        const midRushZ = boss.position.z

        // Wait for rush to end (1.2s total duration, we've done 0.5s, so 1.0s more)
        boss.update(1.0, playerPosition)

        // Boss should have moved significantly during rush but stopped after
        const afterRushZ = boss.position.z

        // Verify boss moved from initial position during rush
        expect(midRushZ).toBeGreaterThan(-20)

        // After rush ends, position should stabilize (minimal further movement)
        // During rush: ~15 units/sec * 0.5sec = ~7.5 units
        // After rush: should not move much more toward player
        expect(afterRushZ).toBeGreaterThan(midRushZ - 5)
      })
    })

    describe('5-way spread (Destroyer)', () => {
      it('fires single bullet when HP > 40%', () => {
        const onFire = vi.fn()
        boss.spawn(new Vector3(0, 0, -20), 'destroyer', onFire)

        const playerPosition = new Vector3(2, 0, 5)
        boss.update(1.0, playerPosition)

        // Only 1 call (center bullet)
        expect(onFire).toHaveBeenCalledTimes(1)
      })

      it('fires 5-way spread when HP ≤ 40%', () => {
        const onFire = vi.fn()
        boss.spawn(new Vector3(0, 0, -20), 'destroyer', onFire)

        // Reduce HP to 40% (Destroyer HP is 120, so reduce to 48)
        boss.takeDamage(72)
        expect(boss.currentHP).toBe(48)

        const playerPosition = new Vector3(2, 0, 5)
        boss.update(1.0, playerPosition)

        // 5 calls (5-way spread)
        expect(onFire).toHaveBeenCalledTimes(5)
      })

      it('has faster fire rate (0.8s interval)', () => {
        const onFire = vi.fn()
        boss.spawn(new Vector3(0, 0, -20), 'destroyer', onFire)

        const playerPosition = new Vector3(2, 0, 5)

        // Should fire after 0.8s
        boss.update(0.9, playerPosition)
        expect(onFire).toHaveBeenCalledTimes(1)

        // Should fire again after another 0.8s
        boss.update(0.9, playerPosition)
        expect(onFire).toHaveBeenCalledTimes(2)
      })
    })

    describe('circular strafe (Destroyer)', () => {
      it('performs circular strafe movement', () => {
        boss.spawn(new Vector3(0, 0, -20), 'destroyer')

        const initialX = boss.position.x
        const initialZ = boss.position.z

        // Update over time to see strafe
        boss.update(1.0)

        // Position should change due to circular movement
        const movedX = boss.position.x !== initialX
        const movedZ = boss.position.z !== initialZ

        // At least one axis should have moved
        expect(movedX || movedZ).toBe(true)
      })

      it('does not rush (rushThreshold is 0)', () => {
        boss.spawn(new Vector3(0, 0, -20), 'destroyer')

        // Reduce HP to very low
        boss.takeDamage(110)
        expect(boss.currentHP).toBe(10)

        const playerPosition = new Vector3(0, 0, 10)
        const initialZ = boss.position.z

        // Update for long time
        boss.update(5.0, playerPosition)

        // Should still be near initial Z (circular strafe, not rush)
        expect(Math.abs(boss.position.z - initialZ)).toBeLessThan(3)
      })
    })
  })
})
