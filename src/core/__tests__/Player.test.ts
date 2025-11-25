import { describe, expect, it, vi } from 'vitest'
import { PerspectiveCamera, Vector3 } from 'three'
import { Player } from '../Player'
import { PartsManager } from '../PartsManager'

type PlayerHarness = {
  player: Player
  container: HTMLDivElement
  dispose: () => void
}

const createPlayer = (onFire = vi.fn()): PlayerHarness => {
  const container = document.createElement('div')
  container.style.width = '800px'
  container.style.height = '600px'
  document.body.appendChild(container)

  const partsManager = new PartsManager()
  partsManager.reset()

  const player = new Player({
    camera: new PerspectiveCamera(),
    inputElement: container,
    partsManager,
    onFire
  })

  return {
    player,
    container,
    dispose: () => {
      player.dispose()
      container.remove()
    }
  }
}

describe('Player', () => {
  it('clamps position within runway bounds', () => {
    const harness = createPlayer()
    const { player } = harness

    player.object.position.set(99, 0, -99)
    // @ts-expect-error accessing private helper for verification
    player.clampPosition()

    expect(player.object.position.x).toBe(7)
    expect(player.object.position.z).toBe(-9)

    harness.dispose()
  })

  it('invokes onFire callback with normalized direction', () => {
    const onFire = vi.fn()
    const harness = createPlayer(onFire)
    const { player } = harness

    player.object.position.set(0, 0, 0)
    // @ts-expect-error private member access for deterministic aim
    player.aimPoint.copy(new Vector3(0, 0, 4))
    // @ts-expect-error calling private fire for direct verification
    player.fire()

    expect(onFire).toHaveBeenCalledTimes(1)
    const [origin, direction] = onFire.mock.calls[0]
    expect(origin.z).toBeCloseTo(0.9, 2)
    expect(direction.length()).toBeCloseTo(1, 5)
    expect(direction.z).toBeGreaterThan(0)

    harness.dispose()
  })

  describe('multi-shot weapon system', () => {
    it('fires 2 bullets with spread at multi_shot level 3', () => {
      const onFire = vi.fn()
      const harness = createPlayer(onFire)
      const { player } = harness

      // @ts-expect-error accessing private member for test
      const partsManager = player.partsManager
      // Upgrade multi_shot to level 3 (2-bullet spread)
      partsManager.addScore(1000)
      partsManager.upgrade('multi_shot') // Lv0 → Lv1
      partsManager.upgrade('multi_shot') // Lv1 → Lv2
      partsManager.upgrade('multi_shot') // Lv2 → Lv3
      partsManager.addBossCore(1)
      partsManager.upgrade('multi_shot') // Lv3 (requires 1 boss core)

      player.object.position.set(0, 0, 0)
      // @ts-expect-error private member access for deterministic aim
      player.aimPoint.copy(new Vector3(0, 0, 4))
      // @ts-expect-error calling private fire
      player.fire()

      // Should fire 2 bullets
      expect(onFire).toHaveBeenCalledTimes(2)

      // Verify spread angles
      const [, dir1] = onFire.mock.calls[0]
      const [, dir2] = onFire.mock.calls[1]

      // Both should be normalized
      expect(dir1.length()).toBeCloseTo(1, 5)
      expect(dir2.length()).toBeCloseTo(1, 5)

      // Should have different X components (spread)
      expect(Math.abs(dir1.x - dir2.x)).toBeGreaterThan(0.1)

      harness.dispose()
    })

    it('fires 3 bullets with spread at multi_shot level 4', () => {
      const onFire = vi.fn()
      const harness = createPlayer(onFire)
      const { player } = harness

      // @ts-expect-error accessing private member for test
      const partsManager = player.partsManager
      // Upgrade multi_shot to level 4 (3-bullet spread)
      partsManager.addScore(3000)
      partsManager.addBossCore(10)
      partsManager.upgrade('multi_shot') // Lv0 → Lv1
      partsManager.upgrade('multi_shot') // Lv1 → Lv2
      partsManager.upgrade('multi_shot') // Lv2 → Lv3
      partsManager.upgrade('multi_shot') // Lv3 → Lv4

      player.object.position.set(0, 0, 0)
      // @ts-expect-error private member access for deterministic aim
      player.aimPoint.copy(new Vector3(0, 0, 4))
      // @ts-expect-error calling private fire
      player.fire()

      // Should fire 3 bullets
      expect(onFire).toHaveBeenCalledTimes(3)

      // Verify all bullets are normalized
      for (let i = 0; i < 3; i++) {
        const [, dir] = onFire.mock.calls[i]
        expect(dir.length()).toBeCloseTo(1, 5)
      }

      harness.dispose()
    })

    it('reduces fire interval with multi_shot upgrades', () => {
      const onFire = vi.fn()
      const harness = createPlayer(onFire)
      const { player } = harness

      // @ts-expect-error accessing private member for test
      const partsManager = player.partsManager

      // Initial fire interval (level 0)
      // @ts-expect-error calling private getFireInterval
      const initialInterval = player.getFireInterval()
      expect(initialInterval).toBe(0.18)

      // Upgrade to level 1 (faster fire rate)
      partsManager.addScore(500)
      partsManager.upgrade('multi_shot') // Lv0 → Lv1

      // @ts-expect-error calling private getFireInterval
      const level1Interval = player.getFireInterval()
      expect(level1Interval).toBe(0.144) // -20% from data

      // Upgrade to level 2 (even faster)
      partsManager.addScore(500)
      partsManager.upgrade('multi_shot') // Lv1 → Lv2

      // @ts-expect-error calling private getFireInterval
      const level2Interval = player.getFireInterval()
      expect(level2Interval).toBe(0.117) // -35% from data

      harness.dispose()
    })
  })
})
