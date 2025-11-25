import {
  BoxGeometry,
  ConeGeometry,
  CylinderGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  Vector3
} from 'three'

const ENEMY_CAPACITY = 18
const MAX_ACTIVE_ENEMIES = 8
const SPAWN_INTERVAL_BASE = 1.6
const SPAWN_INTERVAL_VARIANCE = 0.9
const SPAWN_X_RANGE = { min: -6.5, max: 6.5 }
const SPAWN_Z_RANGE = { min: -34, max: -24 }
const DESPAWN_Z = 9
const SPEED_RANGE = { min: 6, max: 11 }

const randomRange = (min: number, max: number): number => min + Math.random() * (max - min)

export class Enemy {
  readonly object = new Group()

  private readonly meshes: Mesh[] = []
  private readonly velocity = new Vector3()
  private active = false
  private baseX = 0
  private swayAmplitude = 0
  private swayPhase = 0
  private swaySpeed = 0

  constructor() {
    this.object.visible = false
    this.object.position.set(0, 0, 0)
    this.buildGeometry()
  }

  get position(): Vector3 {
    return this.object.position
  }

  spawn(position: Vector3, forwardSpeed: number): void {
    this.baseX = position.x
    this.swayAmplitude = randomRange(0.4, 1.6)
    this.swayPhase = Math.random() * Math.PI * 2
    this.swaySpeed = randomRange(1.2, 2.1)
    this.object.position.copy(position)
    this.velocity.set(0, 0, forwardSpeed)
    this.active = true
    this.object.visible = true
  }

  update(delta: number): void {
    if (!this.active) {
      return
    }

    this.object.position.addScaledVector(this.velocity, delta)
    if (this.swayAmplitude > 0) {
      this.swayPhase += this.swaySpeed * delta
      this.object.position.x = this.baseX + Math.sin(this.swayPhase) * this.swayAmplitude
    }
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

  private buildGeometry(): void {
    const hull = new Mesh(
      new ConeGeometry(0.6, 2.2, 8),
      new MeshStandardMaterial({ color: 0xdc2626, emissive: 0x7f1d1d, metalness: 0.2, roughness: 0.75 })
    )
    hull.rotation.set(Math.PI / 2, 0, 0)
    hull.position.set(0, 0.2, 0)
    this.addMesh(hull)

    const cockpit = new Mesh(
      new BoxGeometry(0.5, 0.5, 0.8),
      new MeshStandardMaterial({ color: 0x0ea5e9, emissive: 0x0369a1, roughness: 0.4 })
    )
    cockpit.position.set(0, 0.5, -0.1)
    this.addMesh(cockpit)

    const wingMaterial = new MeshStandardMaterial({ color: 0xb91c1c, emissive: 0x7f1d1d, roughness: 0.7 })
    const leftWing = new Mesh(new BoxGeometry(1.8, 0.12, 0.6), wingMaterial)
    leftWing.position.set(-0.9, 0.15, -0.2)
    const rightWing = leftWing.clone()
    rightWing.position.x *= -1
    this.addMesh(leftWing)
    this.addMesh(rightWing)

    const thruster = new Mesh(
      new CylinderGeometry(0.25, 0.25, 0.8, 8),
      new MeshStandardMaterial({ color: 0xfacc15, emissive: 0xf97316, roughness: 0.3 })
    )
    thruster.rotation.set(Math.PI / 2, 0, 0)
    thruster.position.set(0, 0, -0.9)
    this.addMesh(thruster)
  }

  private addMesh(mesh: Mesh): void {
    this.meshes.push(mesh)
    this.object.add(mesh)
  }
}

export class EnemyManager {
  readonly group = new Group()

  private readonly enemies: Enemy[]
  private spawnTimer = 0
  private readonly spawnPosition = new Vector3()
  private killCount = 0
  private spawningEnabled = true

  constructor(capacity = ENEMY_CAPACITY) {
    this.enemies = Array.from({ length: capacity }, () => new Enemy())
    this.enemies.forEach((enemy) => this.group.add(enemy.object))
    this.resetSpawnTimer()
  }

  update(delta: number): void {
    this.spawnTimer -= delta
    if (this.spawnTimer <= 0) {
      this.trySpawn()
    }

    this.enemies.forEach((enemy) => {
      enemy.update(delta)
      if (enemy.isActive() && enemy.position.z > DESPAWN_Z) {
        enemy.deactivate()
      }
    })
  }

  getActiveEnemies(): readonly Enemy[] {
    return this.enemies.filter((enemy) => enemy.isActive())
  }

  getKillCount(): number {
    return this.killCount
  }

  incrementKillCount(): void {
    this.killCount += 1
  }

  setSpawningEnabled(enabled: boolean): void {
    this.spawningEnabled = enabled
  }

  dispose(): void {
    this.enemies.forEach((enemy) => enemy.dispose())
  }

  private trySpawn(): void {
    if (!this.spawningEnabled || this.countActive() >= MAX_ACTIVE_ENEMIES) {
      this.resetSpawnTimer()
      return
    }

    const enemy = this.enemies.find((item) => !item.isActive())
    if (!enemy) {
      this.resetSpawnTimer()
      return
    }

    const x = randomRange(SPAWN_X_RANGE.min, SPAWN_X_RANGE.max)
    const z = randomRange(SPAWN_Z_RANGE.min, SPAWN_Z_RANGE.max)
    this.spawnPosition.set(x, 0, z)
    const speed = randomRange(SPEED_RANGE.min, SPEED_RANGE.max)
    enemy.spawn(this.spawnPosition, speed)
    this.resetSpawnTimer()
  }

  private countActive(): number {
    return this.enemies.reduce((count, enemy) => (enemy.isActive() ? count + 1 : count), 0)
  }

  private resetSpawnTimer(): void {
    this.spawnTimer = SPAWN_INTERVAL_BASE + Math.random() * SPAWN_INTERVAL_VARIANCE
  }
}
