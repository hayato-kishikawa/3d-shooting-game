import { describe, expect, it } from 'vitest'
import { Vector3 } from 'three'
import { BulletPool } from '../Bullet'

describe('BulletPool', () => {
  it('deactivates projectiles after lifetime expires', () => {
    const pool = new BulletPool(1)

    pool.fire(new Vector3(0, 0, 0), new Vector3(0, 0, 1))
    pool.update(5)

    const mesh = pool.group.children[0]
    expect(mesh.visible).toBe(false)

    pool.dispose()
  })

  it('reuses bullets when capacity is exceeded', () => {
    const pool = new BulletPool(1)
    const mesh = pool.group.children[0]

    pool.fire(new Vector3(0, 0, 0), new Vector3(0, 0, 1))
    const firstPositionZ = mesh.position.z

    pool.fire(new Vector3(0, 0, 5), new Vector3(0, 0, 1))
    expect(mesh.position.z).not.toBe(firstPositionZ)

    pool.dispose()
  })
})
