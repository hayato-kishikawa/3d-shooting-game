import {
  CylinderGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  Vector3
} from 'three'

const BULLET_SPEED = 42
const BULLET_LIFETIME = 3

export class Bullet {
  readonly mesh: Mesh

  private readonly velocity = new Vector3()
  private lifeRemaining = 0
  private active = false

  constructor() {
    const geometry = new CylinderGeometry(0.08, 0.08, 1.4, 6)
    geometry.rotateX(Math.PI / 2)
    const material = new MeshStandardMaterial({ color: 0xfcd34d, emissive: 0xf59e0b })
    this.mesh = new Mesh(geometry, material)
    this.mesh.visible = false
  }

  fire(origin: Vector3, direction: Vector3): void {
    this.mesh.position.copy(origin)
    this.velocity.copy(direction).normalize().multiplyScalar(BULLET_SPEED)
    this.lifeRemaining = BULLET_LIFETIME
    this.active = true
    this.mesh.visible = true
  }

  update(delta: number): void {
    if (!this.active) {
      return
    }

    this.lifeRemaining -= delta
    if (this.lifeRemaining <= 0) {
      this.deactivate()
      return
    }

    this.mesh.position.addScaledVector(this.velocity, delta)
  }

  deactivate(): void {
    this.active = false
    this.mesh.visible = false
  }

  isActive(): boolean {
    return this.active
  }
}

export class BulletPool {
  readonly group = new Group()

  private readonly bullets: Bullet[]

  constructor(capacity = 32) {
    this.bullets = Array.from({ length: capacity }, () => new Bullet())
    this.bullets.forEach((bullet) => this.group.add(bullet.mesh))
  }

  fire(origin: Vector3, direction: Vector3): void {
    const bullet = this.findAvailable()
    bullet.fire(origin, direction)
  }

  update(delta: number): void {
    this.bullets.forEach((bullet) => bullet.update(delta))
  }

  getActiveBullets(): readonly Bullet[] {
    return this.bullets.filter((bullet) => bullet.isActive())
  }

  dispose(): void {
    this.bullets.forEach((bullet) => {
      bullet.deactivate()
      bullet.mesh.geometry.dispose()
      if (Array.isArray(bullet.mesh.material)) {
        bullet.mesh.material.forEach((material) => material.dispose())
      } else {
        bullet.mesh.material.dispose()
      }
    })
  }

  private findAvailable(): Bullet {
    const inactive = this.bullets.find((bullet) => !bullet.isActive())
    if (inactive) {
      return inactive
    }
    return this.bullets[0]
  }
}
