export type GameOverOptions = {
  container: HTMLElement
  onRestart: () => void
}

export class GameOver {
  private readonly root: HTMLDivElement
  private readonly onRestart: () => void
  private visible = false

  constructor(options: GameOverOptions) {
    this.onRestart = options.onRestart

    this.root = document.createElement('div')
    this.root.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: none;
      justify-content: center;
      align-items: center;
      background: rgba(0, 0, 0, 0.85);
      z-index: 1000;
      font-family: monospace;
      color: #fff;
    `

    const content = document.createElement('div')
    content.style.cssText = `
      text-align: center;
    `

    const title = document.createElement('h1')
    title.textContent = 'GAME OVER'
    title.style.cssText = `
      font-size: 48px;
      margin: 0 0 20px 0;
      color: #ef4444;
      text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.8);
    `

    const scoreDisplay = document.createElement('div')
    scoreDisplay.id = 'game-over-score'
    scoreDisplay.style.cssText = `
      font-size: 24px;
      margin-bottom: 40px;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
    `

    const restartButton = document.createElement('button')
    restartButton.textContent = 'RESTART'
    restartButton.style.cssText = `
      font-family: monospace;
      font-size: 20px;
      padding: 12px 40px;
      background: #3b82f6;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
      transition: background 0.2s;
    `
    restartButton.addEventListener('mouseenter', () => {
      restartButton.style.background = '#2563eb'
    })
    restartButton.addEventListener('mouseleave', () => {
      restartButton.style.background = '#3b82f6'
    })
    restartButton.addEventListener('click', () => this.handleRestart())

    content.appendChild(title)
    content.appendChild(scoreDisplay)
    content.appendChild(restartButton)
    this.root.appendChild(content)
    options.container.appendChild(this.root)
  }

  show(finalScore: number): void {
    const scoreDisplay = this.root.querySelector('#game-over-score')!
    scoreDisplay.textContent = `Final Score: ${finalScore}`
    this.root.style.display = 'flex'
    this.visible = true
  }

  hide(): void {
    this.root.style.display = 'none'
    this.visible = false
  }

  isVisible(): boolean {
    return this.visible
  }

  private handleRestart(): void {
    this.hide()
    this.onRestart()
  }

  dispose(): void {
    this.root.remove()
  }
}
