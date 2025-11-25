import {
  BoxGeometry,
  ConeGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  Vector3
} from 'three'

const BOSS_SIZE = { width: 6, height: 3, depth: 3 }
const BOSS_SWAY_AMPLITUDE = 4
const BOSS_SWAY_PERIOD = 3.0
const FIRE_INTERVAL = 1.8
const HP_THRESHOLD_3WAY = 0.5
const HP_THRESHOLD_RUSH = 0.3
const RUSH_INTERVAL = 4.0
const RUSH_SPEED = 15

export class Boss {
  readonly object = new Group()

  private readonly meshes: Mesh[] = []
  private hp = 0
  private maxHP = 0
  private active = false
  private swayPhase = 0
  private centerX = 0
  private fireCooldown = 0
  private rushCooldown = 0
  private isRushing = false
  private rushDuration = 0
  private onFire?: (origin: Vector3, direction: Vector3) => void

  constructor() {
    this.object.visible = false
    this.buildGeometry()
  }

  get position(): Vector3 {
    return this.object.position
  }

  get currentHP(): number {
    return this.hp
  }

  get maxHitPoints(): number {
    return this.maxHP
  }

  spawn(position: Vector3, hp: number, onFire?: (origin: Vector3, direction: Vector3) => void): void {
    this.hp = hp
    this.maxHP = hp
    this.centerX = position.x
    this.swayPhase = 0
    this.fireCooldown = FIRE_INTERVAL
    this.rushCooldown = RUSH_INTERVAL
    this.isRushing = false
    this.rushDuration = 0
    this.onFire = onFire
    this.object.position.copy(position)
    this.active = true
    this.object.visible = true
  }

  update(delta: number, playerPosition?: Vector3): void {
    if (!this.active) {
      return
    }

    const hpPercent = this.maxHP > 0 ? this.hp / this.maxHP : 0

    // Rush attack (HP ≤ 30%)
    if (hpPercent <= HP_THRESHOLD_RUSH && playerPosition) {
      this.rushCooldown -= delta

      if (this.isRushing) {
        this.rushDuration -= delta
        const direction = new Vector3()
          .copy(playerPosition)
          .sub(this.object.position)
        direction.y = 0
        direction.normalize()
        this.object.position.addScaledVector(direction, RUSH_SPEED * delta)

        if (this.rushDuration <= 0) {
          this.isRushing = false
          this.rushCooldown = RUSH_INTERVAL
        }
      } else if (this.rushCooldown <= 0) {
        this.isRushing = true
        this.rushDuration = 1.2
      }
    }

    // Left-right sway motion (when not rushing)
    if (!this.isRushing) {
      this.swayPhase += delta
      const swayOffset = Math.sin((this.swayPhase / BOSS_SWAY_PERIOD) * Math.PI * 2) * BOSS_SWAY_AMPLITUDE
      this.object.position.x = this.centerX + swayOffset
    }

    // Fire at player
    this.fireCooldown -= delta
    if (this.fireCooldown <= 0 && this.onFire && playerPosition) {
      this.fire(playerPosition, hpPercent)
      this.fireCooldown = FIRE_INTERVAL
    }
  }

  takeDamage(amount: number): boolean {
    if (!this.active) {
      return false
    }

    this.hp = Math.max(0, this.hp - amount)
    if (this.hp <= 0) {
      this.deactivate()
      return true
    }
    return false
  }

  deactivate(): void {
    if (!this.active) {
      return
    }

    this.active = false
    this.object.visible = false
  }

  isActive(): boolean {
    return this.active
  }

  dispose(): void {
    this.meshes.forEach((mesh) => {
      mesh.geometry.dispose()
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((material) => material.dispose())
      } else {
        mesh.material.dispose()
      }
    })
  }

  private fire(playerPosition: Vector3, hpPercent: number): void {
    if (!this.onFire) {
      return
    }

    const direction = new Vector3()
      .copy(playerPosition)
      .sub(this.object.position)
    direction.y = 0
    direction.normalize()

    const origin = new Vector3().copy(this.object.position)
    origin.y += 0.5
    origin.addScaledVector(direction, 2.0)

    // Always fire center bullet
    this.onFire(origin, direction)

    // 3-way spread when HP ≤ 50%
    if (hpPercent <= HP_THRESHOLD_3WAY) {
      const spreadAngle = Math.PI / 8

      // Left bullet
      const leftDir = direction.clone()
      const cosLeft = Math.cos(-spreadAngle)
      const sinLeft = Math.sin(-spreadAngle)
      const leftX = leftDir.x * cosLeft - leftDir.z * sinLeft
      const leftZ = leftDir.x * sinLeft + leftDir.z * cosLeft
      leftDir.set(leftX, 0, leftZ).normalize()
      this.onFire(origin, leftDir)

      // Right bullet
      const rightDir = direction.clone()
      const cosRight = Math.cos(spreadAngle)
      const sinRight = Math.sin(spreadAngle)
      const rightX = rightDir.x * cosRight - rightDir.z * sinRight
      const rightZ = rightDir.x * sinRight + rightDir.z * cosRight
      rightDir.set(rightX, 0, rightZ).normalize()
      this.onFire(origin, rightDir)
    }
  }

  private buildGeometry(): void {
    // Main hull - large dark box
    const hull = new Mesh(
      new BoxGeometry(BOSS_SIZE.width, BOSS_SIZE.height, BOSS_SIZE.depth),
      new MeshStandardMaterial({
        color: 0x7f1d1d,
        emissive: 0x450a0a,
        metalness: 0.6,
        roughness: 0.3
      })
    )
    this.addMesh(hull)

    // Cannons - two cones on sides
    const cannonGeometry = new ConeGeometry(0.4, 1.5, 8)
    cannonGeometry.rotateX(Math.PI / 2)

    const cannonMaterial = new MeshStandardMaterial({
      color: 0xdc2626,
      emissive: 0x991b1b
    })

    const leftCannon = new Mesh(cannonGeometry, cannonMaterial)
    leftCannon.position.set(-2.5, 0, 1.0)
    this.addMesh(leftCannon)

    const rightCannon = new Mesh(cannonGeometry.clone(), cannonMaterial.clone())
    rightCannon.position.set(2.5, 0, 1.0)
    this.addMesh(rightCannon)

    // Core - glowing center
    const core = new Mesh(
      new BoxGeometry(1.2, 1.2, 1.2),
      new MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 0.8
      })
    )
    core.position.set(0, 0, 0.5)
    this.addMesh(core)
  }

  private addMesh(mesh: Mesh): void {
    this.meshes.push(mesh)
    this.object.add(mesh)
  }
}
