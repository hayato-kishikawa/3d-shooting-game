import {
  CylinderGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  Vector3
} from 'three'

const BOSS_BULLET_SPEED = 35
const BOSS_BULLET_DAMAGE = 8

export class BossBullet {
  readonly mesh: Mesh

  private readonly velocity = new Vector3()
  private lifeRemaining = 0
  private active = false

  constructor() {
    const geometry = new CylinderGeometry(0.12, 0.12, 1.6, 8)
    geometry.rotateX(Math.PI / 2)
    const material = new MeshStandardMaterial({
      color: 0xdc2626,
      emissive: 0x991b1b
    })
    this.mesh = new Mesh(geometry, material)
    this.mesh.visible = false
  }

  fire(origin: Vector3, direction: Vector3, bulletSpeed = BOSS_BULLET_SPEED, range = 60): void {
    this.mesh.position.copy(origin)
    this.velocity.copy(direction).normalize().multiplyScalar(bulletSpeed)
    this.lifeRemaining = range / bulletSpeed
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

  getDamage(): number {
    return BOSS_BULLET_DAMAGE
  }
}

export class BossBulletPool {
  readonly group = new Group()

  private readonly bullets: BossBullet[]

  constructor(capacity = 50) {
    this.bullets = Array.from({ length: capacity }, () => new BossBullet())
    this.bullets.forEach((bullet) => this.group.add(bullet.mesh))
  }

  fire(origin: Vector3, direction: Vector3, bulletSpeed?: number, range?: number): void {
    const bullet = this.findAvailable()
    bullet.fire(origin, direction, bulletSpeed, range)
  }

  update(delta: number): void {
    this.bullets.forEach((bullet) => bullet.update(delta))
  }

  getActiveBullets(): readonly BossBullet[] {
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

  private findAvailable(): BossBullet {
    const inactive = this.bullets.find((bullet) => !bullet.isActive())
    if (inactive) {
      return inactive
    }
    return this.bullets[0]
  }
}
