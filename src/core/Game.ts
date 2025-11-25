import {
  AmbientLight,
  Clock,
  Color,
  DirectionalLight,
  GridHelper,
  Group,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PlaneGeometry,
  Scene,
  Vector3
} from 'three'
import { Renderer } from '../graphics/Renderer'
import { GameCamera } from '../graphics/Camera'
import { Player } from './Player'
import { BulletPool } from './Bullet'
import { EnemyManager } from './Enemy'
import { checkBulletEnemyCollisions, checkPlayerEnemyCollision } from './Collision'
import { HUD } from '../ui/HUD'
import { GameOver } from '../ui/GameOver'
import { Shop } from '../ui/Shop'
import { PartsManager } from './PartsManager'

type GameOptions = {
  container: HTMLElement
}

export class Game {
  private readonly scene = new Scene()
  private readonly renderer: Renderer
  private readonly camera: GameCamera
  private readonly player: Player
  private readonly bullets: BulletPool
  private readonly enemies: EnemyManager
  private readonly hud: HUD
  private readonly gameOver: GameOver
  private readonly shop: Shop
  private readonly partsManager: PartsManager
  private readonly clock = new Clock()
  private readonly resizeHandler = () => this.handleResize()
  private readonly shopKeyHandler = (e: KeyboardEvent) => this.handleShopKey(e)
  private animationFrameId: number | null = null
  private elapsed = 0
  private isGameOver = false

  private readonly cameraTarget = new Vector3()
  private readonly cameraOffset = new Vector3(0, 20, 15)
  private readonly desiredCameraPosition = new Vector3()
  private readonly scrollables: Object3D[] = []

  constructor(options: GameOptions) {
    this.renderer = new Renderer(options.container)
    this.camera = new GameCamera()
    this.bullets = new BulletPool()
    this.enemies = new EnemyManager()
    this.partsManager = new PartsManager()
    this.hud = new HUD({ container: options.container, partsManager: this.partsManager })
    this.gameOver = new GameOver({
      container: options.container,
      onRestart: () => this.restart()
    })
    this.shop = new Shop({
      container: options.container,
      partsManager: this.partsManager,
      onClose: () => this.handleShopClose()
    })
    this.player = new Player({
      camera: this.camera.instance,
      inputElement: options.container,
      partsManager: this.partsManager,
      onFire: (origin, direction) => this.handlePlayerFire(origin, direction)
    })
    this.initializeScene()
  }

  start(): void {
    if (this.animationFrameId !== null) {
      return
    }

    this.clock.start()
    this.handleResize()
    window.addEventListener('resize', this.resizeHandler)
    window.addEventListener('keydown', this.shopKeyHandler)
    this.animationFrameId = requestAnimationFrame(this.loop)
  }

  dispose(): void {
    this.stop()
    this.renderer.dispose()
    this.player.dispose()
    this.bullets.dispose()
    this.enemies.dispose()
    this.hud.dispose()
    this.gameOver.dispose()
    this.shop.dispose()
    this.partsManager.dispose()
    window.removeEventListener('resize', this.resizeHandler)
    window.removeEventListener('keydown', this.shopKeyHandler)
  }

  private stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
  }

  private readonly loop = (): void => {
    const delta = this.clock.getDelta()
    this.elapsed += delta
    this.update(delta)
    this.renderer.render(this.scene, this.camera.instance)
    this.animationFrameId = requestAnimationFrame(this.loop)
  }

  private update(delta: number): void {
    if (this.isGameOver || this.shop.isVisible()) {
      return
    }

    this.player.update(delta)
    const roll = Math.sin(this.elapsed * 1.2) * 0.12
    this.player.object.rotation.z = roll

    this.cameraTarget.copy(this.player.position)
    this.camera.lookAt(this.cameraTarget)
    this.desiredCameraPosition.copy(this.player.position).add(this.cameraOffset)
    this.camera.moveTowards(this.desiredCameraPosition, 0.08)

    this.bullets.update(delta)
    this.enemies.update(delta)

    // Collision detection
    const bulletHits = checkBulletEnemyCollisions(
      this.bullets.getActiveBullets(),
      this.enemies.getActiveEnemies()
    )
    bulletHits.forEach((hit) => {
      hit.bullet.deactivate()
      hit.enemy.deactivate()
      this.enemies.incrementKillCount()
      const scoreGained = 10
      this.hud.addScore(scoreGained)
      this.partsManager.addScore(scoreGained)
    })

    const playerHit = checkPlayerEnemyCollision(this.player, this.enemies.getActiveEnemies())
    if (playerHit) {
      playerHit.deactivate()
      this.hud.addHP(-10)
      if (this.hud.getHP() <= 0) {
        this.triggerGameOver()
      }
    }

    this.scrollFloor(delta)
  }

  private triggerGameOver(): void {
    this.isGameOver = true
    this.gameOver.show(this.hud.getScore())
  }

  private restart(): void {
    this.isGameOver = false
    this.hud.reset()
    this.player.object.position.set(0, 0, 0)

    // Deactivate all active bullets and enemies
    this.bullets.getActiveBullets().forEach((bullet) => bullet.deactivate())
    this.enemies.getActiveEnemies().forEach((enemy) => enemy.deactivate())
  }

  private scrollFloor(delta: number): void {
    const speed = 6
    this.scrollables.forEach((object) => {
      object.position.z += delta * speed
      if (object.position.z > 6) {
        object.position.z -= 12
      }
    })
  }

  private handleResize(): void {
    const { width, height } = this.renderer.getSize()
    const safeWidth = Math.max(width, 1)
    const safeHeight = Math.max(height, 1)
    this.renderer.resize(safeWidth, safeHeight)
    this.camera.setAspect(safeWidth / safeHeight)
  }

  private initializeScene(): void {
    this.scene.background = new Color('#020617')

    const ambient = new AmbientLight(0xffffff, 0.45)
    const directional = new DirectionalLight(0xffffff, 0.9)
    directional.position.set(4, 8, 6)

    this.scene.add(this.player.object)
    this.scene.add(this.bullets.group)
    this.scene.add(this.enemies.group)

    const runwaySegments = this.createRunwaySegments()
    runwaySegments.forEach((segment) => this.scene.add(segment))

    const helper = new GridHelper(40, 20, 0x1d4ed8, 0x1e293b)
    helper.position.y = -0.49

    this.scene.add(ambient, directional, helper)
  }
  private createRunwaySegments(): Group[] {
    const segments: Group[] = []
    for (let i = 0; i < 2; i += 1) {
      const segment = new Group()
      const plane = new Mesh(
        new PlaneGeometry(8, 12),
        new MeshStandardMaterial({ color: 0x0f172a, metalness: 0.1, roughness: 0.8 })
      )
      plane.rotation.x = -Math.PI / 2
      plane.position.y = -0.5

      const stripMaterial = new MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xf59e0b })
      const strip = new Mesh(new PlaneGeometry(0.3, 8), stripMaterial)
      strip.rotation.x = -Math.PI / 2
      strip.position.set(0, -0.48, 0)

      segment.add(plane, strip)
      segment.position.z = -i * 12
      segments.push(segment)
      this.scrollables.push(segment)
    }
    return segments
  }

  private handleShopKey(e: KeyboardEvent): void {
    if (e.key.toLowerCase() === 's' && !this.isGameOver) {
      if (this.shop.isVisible()) {
        this.shop.hide()
      } else {
        this.shop.show()
      }
    } else if (e.key === 'Escape' && this.shop.isVisible()) {
      this.shop.hide()
    }
  }

  private handleShopClose(): void {
    // Shop closed, game resumes automatically via update() check
  }

  private handlePlayerFire(origin: Vector3, direction: Vector3): void {
    const laserStats = this.partsManager.getCurrentStats('laser_cannon')
    const bulletSpeed = laserStats?.bulletSpeed ?? 40
    const range = laserStats?.range ?? 50
    this.bullets.fire(origin, direction, bulletSpeed, range)
  }
}
