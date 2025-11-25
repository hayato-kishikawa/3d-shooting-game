import { describe, expect, it, vi } from 'vitest'
import { PerspectiveCamera, Vector3 } from 'three'
import { Player } from '../Player'

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

  const player = new Player({
    camera: new PerspectiveCamera(),
    inputElement: container,
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
})
