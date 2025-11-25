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

export class Boss {
  readonly object = new Group()

  private readonly meshes: Mesh[] = []
  private hp = 0
  private maxHP = 0
  private active = false
  private swayPhase = 0
  private centerX = 0
  private fireCooldown = 0
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
    this.onFire = onFire
    this.object.position.copy(position)
    this.active = true
    this.object.visible = true
  }

  update(delta: number, playerPosition?: Vector3): void {
    if (!this.active) {
      return
    }

    // Left-right sway motion
    this.swayPhase += delta
    const swayOffset = Math.sin((this.swayPhase / BOSS_SWAY_PERIOD) * Math.PI * 2) * BOSS_SWAY_AMPLITUDE
    this.object.position.x = this.centerX + swayOffset

    // Fire at player
    this.fireCooldown -= delta
    if (this.fireCooldown <= 0 && this.onFire && playerPosition) {
      this.fire(playerPosition)
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

  private fire(playerPosition: Vector3): void {
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

    this.onFire(origin, direction)
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
