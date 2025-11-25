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

type PlayerOptions = {
  camera: PerspectiveCamera
  inputElement: HTMLElement
}

const MOVE_SPEED = 12
const AIM_LERP = 0.35
const CAMERA_PLANE_OFFSET = 0.5 // matches runway height at y = -0.5

export class Player {
  readonly object = new Group()

  private readonly camera: PerspectiveCamera
  private readonly inputElement: HTMLElement
  private readonly keys = new Set<string>()
  private readonly raycaster = new Raycaster()
  private readonly mouseNDC = new Vector2()
  private readonly groundPlane = new Plane(new Vector3(0, 1, 0), CAMERA_PLANE_OFFSET)
  private readonly aimPoint = new Vector3()
  private readonly tmp = new Vector3()

  private readonly keyDownHandler = (event: KeyboardEvent) => this.handleKey(event, true)
  private readonly keyUpHandler = (event: KeyboardEvent) => this.handleKey(event, false)
  private readonly pointerMoveHandler = (event: PointerEvent) => this.handlePointer(event)
  private readonly pointerLeaveHandler = () => {
    this.mouseNDC.set(0, 0)
  }

  constructor(options: PlayerOptions) {
    this.camera = options.camera
    this.inputElement = options.inputElement
    this.object.add(this.createHull())
    this.attachEventListeners()
  }

  get position(): Vector3 {
    return this.object.position
  }

  update(delta: number): void {
    this.updateMovement(delta)
    this.updateAim()
  }

  dispose(): void {
    window.removeEventListener('keydown', this.keyDownHandler)
    window.removeEventListener('keyup', this.keyUpHandler)
    this.inputElement.removeEventListener('pointermove', this.pointerMoveHandler)
    this.inputElement.removeEventListener('pointerleave', this.pointerLeaveHandler)
  }

  private attachEventListeners(): void {
    window.addEventListener('keydown', this.keyDownHandler)
    window.addEventListener('keyup', this.keyUpHandler)
    this.inputElement.addEventListener('pointermove', this.pointerMoveHandler)
    this.inputElement.addEventListener('pointerleave', this.pointerLeaveHandler)
  }

  private handleKey(event: KeyboardEvent, pressed: boolean): void {
    const key = event.code
    if (!['KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(key)) {
      return
    }
    event.preventDefault()
    if (pressed) {
      this.keys.add(key)
    } else {
      this.keys.delete(key)
    }
  }

  private handlePointer(event: PointerEvent): void {
    const rect = this.inputElement.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1)
    this.mouseNDC.set(x, y)
  }

  private updateMovement(delta: number): void {
    const direction = new Vector3(
      (this.keys.has('KeyD') ? 1 : 0) - (this.keys.has('KeyA') ? 1 : 0),
      0,
      (this.keys.has('KeyS') ? 1 : 0) - (this.keys.has('KeyW') ? 1 : 0)
    )

    if (direction.lengthSq() > 0) {
      direction.normalize()
      this.object.position.addScaledVector(direction, MOVE_SPEED * delta)
    }
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
