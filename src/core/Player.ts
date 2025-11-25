import {
  BoxGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Plane,
  Raycaster,
  Vector2,
  Vector3
} from 'three'
import type { PartsManager } from './PartsManager'

type PlayerOptions = {
  camera: PerspectiveCamera
  inputElement: HTMLElement
  partsManager: PartsManager
  onFire?: (origin: Vector3, direction: Vector3) => void
}

const AIM_LERP = 0.35
const CAMERA_PLANE_OFFSET = 0.5 // matches runway height at y = -0.5
const FIRE_INTERVAL = 0.18
const PLAY_AREA = {
  minX: -7,
  maxX: 7,
  minZ: -9,
  maxZ: 5
}

export class Player {
  readonly object = new Group()

  private readonly camera: PerspectiveCamera
  private readonly inputElement: HTMLElement
  private readonly partsManager: PartsManager
  private readonly onFire?: (origin: Vector3, direction: Vector3) => void
  private readonly keys = new Set<string>()
  private readonly raycaster = new Raycaster()
  private readonly mouseNDC = new Vector2()
  private readonly groundPlane = new Plane(new Vector3(0, 1, 0), CAMERA_PLANE_OFFSET)
  private readonly aimPoint = new Vector3()
  private readonly tmp = new Vector3()
  private readonly fireOrigin = new Vector3()
  private readonly fireDirection = new Vector3()
  private readonly moveDirection = new Vector3()

  private pointerFiring = false
  private spaceFiring = false
  private fireCooldown = 0
  private fireRequest = false

  private readonly keyDownHandler = (event: KeyboardEvent) => this.handleKey(event, true)
  private readonly keyUpHandler = (event: KeyboardEvent) => this.handleKey(event, false)
  private readonly pointerMoveHandler = (event: PointerEvent) => this.handlePointer(event)
  private readonly pointerLeaveHandler = () => {
    this.mouseNDC.set(0, 0)
    this.pointerFiring = false
  }
  private readonly pointerDownHandler = () => this.setPointerFiring(true)
  private readonly pointerUpHandler = () => this.setPointerFiring(false)

  constructor(options: PlayerOptions) {
    this.camera = options.camera
    this.inputElement = options.inputElement
    this.partsManager = options.partsManager
    this.onFire = options.onFire
    this.object.add(this.createHull())
    this.attachEventListeners()
  }

  get position(): Vector3 {
    return this.object.position
  }

  update(delta: number): void {
    this.updateMovement(delta)
    this.updateAim()
    this.updateFire(delta)
  }

  dispose(): void {
    window.removeEventListener('keydown', this.keyDownHandler)
    window.removeEventListener('keyup', this.keyUpHandler)
    this.inputElement.removeEventListener('pointermove', this.pointerMoveHandler)
    this.inputElement.removeEventListener('pointerleave', this.pointerLeaveHandler)
    this.inputElement.removeEventListener('pointerdown', this.pointerDownHandler)
    window.removeEventListener('pointerup', this.pointerUpHandler)
  }

  private attachEventListeners(): void {
    window.addEventListener('keydown', this.keyDownHandler)
    window.addEventListener('keyup', this.keyUpHandler)
    this.inputElement.addEventListener('pointermove', this.pointerMoveHandler)
    this.inputElement.addEventListener('pointerleave', this.pointerLeaveHandler)
    this.inputElement.addEventListener('pointerdown', this.pointerDownHandler)
    window.addEventListener('pointerup', this.pointerUpHandler)
  }

  private handleKey(event: KeyboardEvent, pressed: boolean): void {
    const key = event.code
    if (key === 'Space') {
      event.preventDefault()
      this.spaceFiring = pressed
      if (pressed) {
        this.queueFire()
      }
      return
    }

    if (['KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(key)) {
      event.preventDefault()
      if (pressed) {
        this.keys.add(key)
      } else {
        this.keys.delete(key)
      }
    }
  }

  private handlePointer(event: PointerEvent): void {
    const rect = this.inputElement.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1)
    this.mouseNDC.set(x, y)
  }

  private updateMovement(delta: number): void {
    const direction = this.moveDirection
    direction.set(
      (this.keys.has('KeyD') ? 1 : 0) - (this.keys.has('KeyA') ? 1 : 0),
      0,
      (this.keys.has('KeyS') ? 1 : 0) - (this.keys.has('KeyW') ? 1 : 0)
    )

    if (direction.lengthSq() > 0) {
      direction.normalize()
      const moveSpeed = this.getMoveSpeed()
      this.object.position.addScaledVector(direction, moveSpeed * delta)
    }

    this.clampPosition()
  }

  private getMoveSpeed(): number {
    const boosterStats = this.partsManager.getCurrentStats('booster')
    return boosterStats?.moveSpeed ?? 12
  }

  private updateAim(): void {
    this.raycaster.setFromCamera(this.mouseNDC, this.camera)
    const hitPoint = this.raycaster.ray.intersectPlane(this.groundPlane, this.tmp)
    if (hitPoint) {
      this.aimPoint.lerp(hitPoint, AIM_LERP)
      const lookTarget = this.tmp.copy(this.aimPoint)
      lookTarget.y = this.object.position.y
      this.object.lookAt(lookTarget)
    }
  }

  private updateFire(delta: number): void {
    this.fireCooldown = Math.max(0, this.fireCooldown - delta)
    const wantsFire = this.pointerFiring || this.spaceFiring || this.fireRequest
    if (!wantsFire || this.fireCooldown > 0) {
      if (!this.pointerFiring && !this.spaceFiring) {
        this.fireRequest = false
      }
      return
    }

    this.fire()
    this.fireCooldown = FIRE_INTERVAL
    this.fireRequest = this.pointerFiring || this.spaceFiring
  }

  private fire(): void {
    if (!this.onFire) {
      return
    }

    const direction = this.fireDirection.copy(this.aimPoint).sub(this.object.position)
    direction.y = 0
    if (direction.lengthSq() === 0) {
      direction.set(0, 0, 1)
    }
    direction.normalize()

    const origin = this.fireOrigin.copy(this.object.position)
    origin.y += 0.15
    origin.addScaledVector(direction, 0.9)

    this.onFire(origin.clone(), direction.clone())
  }

  private queueFire(): void {
    this.fireRequest = true
  }

  private setPointerFiring(state: boolean): void {
    this.pointerFiring = state
    if (state) {
      this.queueFire()
    }
  }

  private clampPosition(): void {
    this.object.position.x = Math.max(PLAY_AREA.minX, Math.min(PLAY_AREA.maxX, this.object.position.x))
    this.object.position.z = Math.max(PLAY_AREA.minZ, Math.min(PLAY_AREA.maxZ, this.object.position.z))
  }

  private createHull(): Group {
    const hull = new Mesh(
      new BoxGeometry(1.2, 0.6, 2.4),
      new MeshStandardMaterial({ color: 0x60a5fa, emissive: 0x1d4ed8 })
    )

    const canopy = new Mesh(
      new BoxGeometry(0.6, 0.4, 0.8),
      new MeshStandardMaterial({ color: 0xf0f9ff, emissive: 0x1d4ed8, emissiveIntensity: 0.4 })
    )
    canopy.position.set(0, 0.2, 0.2)

    const thruster = new Mesh(
      new BoxGeometry(0.4, 0.4, 0.6),
      new MeshStandardMaterial({ color: 0x0ea5e9, emissive: 0x075985 })
    )
    thruster.position.set(0, -0.1, -1.2)

    const group = new Group()
    group.add(hull, canopy, thruster)

    return group
  }
}
