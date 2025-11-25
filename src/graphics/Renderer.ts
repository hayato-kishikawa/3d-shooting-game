import { Camera, Color, Scene, WebGLRenderer } from 'three'

export class Renderer {
  private readonly renderer: WebGLRenderer
  private readonly container: HTMLElement

  constructor(container: HTMLElement) {
    this.container = container
    this.renderer = new WebGLRenderer({ antialias: true })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setClearColor(new Color('#020617'))
    this.container.appendChild(this.renderer.domElement)
  }

  render(scene: Scene, camera: Camera): void {
    this.renderer.render(scene, camera)
  }

  resize(width: number, height: number): void {
    this.renderer.setSize(width, height, false)
  }

  getSize(): { width: number; height: number } {
    return {
      width: this.container.clientWidth,
      height: this.container.clientHeight
    }
  }

  dispose(): void {
    this.renderer.dispose()
    const canvas = this.renderer.domElement
    if (canvas.parentElement === this.container) {
      this.container.removeChild(canvas)
    }
  }
}
