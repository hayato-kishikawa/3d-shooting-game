import { PerspectiveCamera, Vector3 } from 'three'

const DEFAULT_FOV = 65
const DEFAULT_NEAR = 0.1
const DEFAULT_FAR = 200
const CAMERA_HEIGHT = 20
const CAMERA_DISTANCE = 15

export class GameCamera {
  private readonly camera: PerspectiveCamera
  private readonly target = new Vector3()

  constructor(initialAspect = 1) {
    this.camera = new PerspectiveCamera(DEFAULT_FOV, initialAspect, DEFAULT_NEAR, DEFAULT_FAR)
    this.setDefaultPose()
  }

  get instance(): PerspectiveCamera {
    return this.camera
  }

  setAspect(aspect: number): void {
    this.camera.aspect = aspect
    this.camera.updateProjectionMatrix()
  }

  lookAt(point: Vector3): void {
    this.target.copy(point)
    this.camera.lookAt(this.target)
  }

  moveTowards(position: Vector3, lerpAlpha: number): void {
    this.camera.position.lerp(position, lerpAlpha)
  }

  private setDefaultPose(): void {
    this.camera.position.set(0, CAMERA_HEIGHT, CAMERA_DISTANCE)
    this.target.set(0, 0, 0)
    this.camera.lookAt(this.target)
  }
}
