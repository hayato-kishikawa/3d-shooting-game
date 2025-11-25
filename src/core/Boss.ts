import {
  BoxGeometry,
  ConeGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  Vector3
} from 'three'

export type BossType = 'dreadnought' | 'destroyer' | 'annihilator'

interface BossConfig {
  hp: number
  size: { width: number; height: number; depth: number }
  fireInterval: number
  spreadThreshold: number
  spreadCount: number
  rushThreshold: number
  rushSpeed: number
  rushInterval: number
  movementType: 'sway' | 'strafe' | 'tracking'
  swayAmplitude?: number
  swayPeriod?: number
  strafeRadius?: number
  strafePeriod?: number
}

const BOSS_CONFIGS: Record<BossType, BossConfig> = {
  dreadnought: {
    hp: 50,
    size: { width: 6, height: 3, depth: 3 },
    fireInterval: 1.8,
    spreadThreshold: 0.5,
    spreadCount: 3,
    rushThreshold: 0.3,
    rushSpeed: 15,
    rushInterval: 4.0,
    movementType: 'sway',
    swayAmplitude: 4,
    swayPeriod: 3.0
  },
  destroyer: {
    hp: 120,
    size: { width: 5, height: 2.5, depth: 2.5 },
    fireInterval: 0.8,
    spreadThreshold: 0.4,
    spreadCount: 5,
    rushThreshold: 0,
    rushSpeed: 0,
    rushInterval: 0,
    movementType: 'strafe',
    strafeRadius: 6,
    strafePeriod: 4.0
  },
  annihilator: {
    hp: 250,
    size: { width: 8, height: 4, depth: 4 },
    fireInterval: 1.2,
    spreadThreshold: 0.5,
    spreadCount: 7,
    rushThreshold: 0.5,
    rushSpeed: 20,
    rushInterval: 10.0,
    movementType: 'tracking',
    swayAmplitude: 2,
    swayPeriod: 2.0
  }
}

const RUSH_DURATION = 1.2

export class Boss {
  readonly object = new Group()

  private readonly meshes: Mesh[] = []
  private hp = 0
  private maxHP = 0
  private active = false
  private config: BossConfig = BOSS_CONFIGS.dreadnought
  private swayPhase = 0
  private strafePhase = 0
  private centerX = 0
  private centerZ = 0
  private fireCooldown = 0
  private rushCooldown = 0
  private isRushing = false
  private rushDuration = 0
  private onFire?: (origin: Vector3, direction: Vector3) => void

  constructor() {
    this.object.visible = false
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

  spawn(
    position: Vector3,
    type: BossType = 'dreadnought',
    onFire?: (origin: Vector3, direction: Vector3) => void
  ): void {
    // Clear old geometry if exists
    this.clearGeometry()

    this.config = BOSS_CONFIGS[type]
    this.hp = this.config.hp
    this.maxHP = this.config.hp
    this.centerX = position.x
    this.centerZ = position.z
    this.swayPhase = 0
    this.strafePhase = 0
    this.fireCooldown = this.config.fireInterval
    this.rushCooldown = this.config.rushInterval
    this.isRushing = false
    this.rushDuration = 0
    this.onFire = onFire
    this.object.position.copy(position)

    // Build geometry based on type
    this.buildGeometry()

    this.active = true
    this.object.visible = true
  }

  update(delta: number, playerPosition?: Vector3): void {
    if (!this.active) {
      return
    }

    const hpPercent = this.maxHP > 0 ? this.hp / this.maxHP : 0

    // Rush attack (if configured)
    if (this.config.rushThreshold > 0 && hpPercent <= this.config.rushThreshold && playerPosition) {
      this.rushCooldown -= delta

      if (this.isRushing) {
        this.rushDuration -= delta
        const direction = new Vector3()
          .copy(playerPosition)
          .sub(this.object.position)
        direction.y = 0
        direction.normalize()
        this.object.position.addScaledVector(direction, this.config.rushSpeed * delta)

        if (this.rushDuration <= 0) {
          this.isRushing = false
          this.rushCooldown = this.config.rushInterval
        }
      } else if (this.rushCooldown <= 0) {
        this.isRushing = true
        this.rushDuration = RUSH_DURATION
      }
    }

    // Movement pattern (when not rushing)
    if (!this.isRushing) {
      this.updateMovement(delta)
    }

    // Fire at player
    this.fireCooldown -= delta
    if (this.fireCooldown <= 0 && this.onFire && playerPosition) {
      this.fire(playerPosition, hpPercent)
      this.fireCooldown = this.config.fireInterval
    }
  }

  private updateMovement(delta: number): void {
    switch (this.config.movementType) {
      case 'sway':
        this.swayPhase += delta
        const swayOffset =
          Math.sin((this.swayPhase / (this.config.swayPeriod ?? 3)) * Math.PI * 2) *
          (this.config.swayAmplitude ?? 4)
        this.object.position.x = this.centerX + swayOffset
        break

      case 'strafe':
        this.strafePhase += delta
        const angle = (this.strafePhase / (this.config.strafePeriod ?? 4)) * Math.PI * 2
        const radius = this.config.strafeRadius ?? 6
        this.object.position.x = this.centerX + Math.cos(angle) * radius
        this.object.position.z = this.centerZ + Math.sin(angle) * radius * 0.3
        break

      case 'tracking':
        // Slow tracking toward center with slight sway
        this.swayPhase += delta
        const trackSway =
          Math.sin((this.swayPhase / (this.config.swayPeriod ?? 2)) * Math.PI * 2) *
          (this.config.swayAmplitude ?? 2)
        const targetX = this.centerX + trackSway
        this.object.position.x += (targetX - this.object.position.x) * 0.5 * delta
        break
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
    this.clearGeometry()
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

    // Determine spread count based on HP threshold
    const shouldSpread = hpPercent <= this.config.spreadThreshold
    const bulletCount = shouldSpread ? this.config.spreadCount : 1

    if (bulletCount === 1) {
      // Single bullet
      this.onFire(origin, direction)
    } else {
      // Multi-way spread
      const spreadAngle = Math.PI / 8
      const angleStep = (spreadAngle * 2) / (bulletCount - 1)
      const startAngle = -spreadAngle

      for (let i = 0; i < bulletCount; i++) {
        const angle = startAngle + angleStep * i
        const spreadDir = direction.clone()
        const cos = Math.cos(angle)
        const sin = Math.sin(angle)
        const x = spreadDir.x * cos - spreadDir.z * sin
        const z = spreadDir.x * sin + spreadDir.z * cos
        spreadDir.set(x, 0, z).normalize()
        this.onFire(origin, spreadDir)
      }
    }
  }

  private clearGeometry(): void {
    this.meshes.forEach((mesh) => {
      mesh.geometry.dispose()
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((material) => material.dispose())
      } else {
        mesh.material.dispose()
      }
      this.object.remove(mesh)
    })
    this.meshes.length = 0
  }

  private buildGeometry(): void {
    const size = this.config.size

    // Main hull - dark box
    const hull = new Mesh(
      new BoxGeometry(size.width, size.height, size.depth),
      new MeshStandardMaterial({
        color: 0x7f1d1d,
        emissive: 0x450a0a,
        metalness: 0.6,
        roughness: 0.3
      })
    )
    this.addMesh(hull)

    // Cannons - two cones on sides
    const cannonScale = size.width / 6
    const cannonGeometry = new ConeGeometry(0.4 * cannonScale, 1.5 * cannonScale, 8)
    cannonGeometry.rotateX(Math.PI / 2)

    const cannonMaterial = new MeshStandardMaterial({
      color: 0xdc2626,
      emissive: 0x991b1b
    })

    const cannonOffset = size.width * 0.4
    const leftCannon = new Mesh(cannonGeometry, cannonMaterial)
    leftCannon.position.set(-cannonOffset, 0, 1.0 * cannonScale)
    this.addMesh(leftCannon)

    const rightCannon = new Mesh(cannonGeometry.clone(), cannonMaterial.clone())
    rightCannon.position.set(cannonOffset, 0, 1.0 * cannonScale)
    this.addMesh(rightCannon)

    // Core - glowing center
    const coreSize = Math.min(size.width, size.height, size.depth) * 0.3
    const core = new Mesh(
      new BoxGeometry(coreSize, coreSize, coreSize),
      new MeshStandardMaterial({
        color: 0xff0000,
        emissive: 0xff0000,
        emissiveIntensity: 0.8
      })
    )
    core.position.set(0, 0, size.depth * 0.2)
    this.addMesh(core)
  }

  private addMesh(mesh: Mesh): void {
    this.meshes.push(mesh)
    this.object.add(mesh)
  }
}
