export type StageClearOptions = {
  container: HTMLElement
  onRestart: () => void
}

export class StageClear {
  private readonly root: HTMLDivElement
  private readonly onRestart: () => void
  private visible = false

  constructor(options: StageClearOptions) {
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
    title.textContent = 'BOSS DEFEATED!'
    title.style.cssText = `
      font-size: 48px;
      margin: 0 0 20px 0;
      color: #10b981;
      text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.8);
    `

    const scoreDisplay = document.createElement('div')
    scoreDisplay.id = 'stage-clear-score'
    scoreDisplay.style.cssText = `
      font-size: 24px;
      margin-bottom: 15px;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
    `

    const bossCoreDisplay = document.createElement('div')
    bossCoreDisplay.id = 'stage-clear-cores'
    bossCoreDisplay.style.cssText = `
      font-size: 20px;
      margin-bottom: 40px;
      color: #8b5cf6;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
    `

    const restartButton = document.createElement('button')
    restartButton.textContent = 'RESTART (R)'
    restartButton.style.cssText = `
      font-family: monospace;
      font-size: 20px;
      padding: 12px 40px;
      background: #10b981;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
      transition: background 0.2s;
    `
    restartButton.addEventListener('mouseenter', () => {
      restartButton.style.background = '#059669'
    })
    restartButton.addEventListener('mouseleave', () => {
      restartButton.style.background = '#10b981'
    })
    restartButton.addEventListener('click', () => this.handleRestart())

    content.appendChild(title)
    content.appendChild(scoreDisplay)
    content.appendChild(bossCoreDisplay)
    content.appendChild(restartButton)
    this.root.appendChild(content)
    options.container.appendChild(this.root)
  }

  show(finalScore: number, bossCoresGained: number): void {
    const scoreDisplay = this.root.querySelector('#stage-clear-score')!
    scoreDisplay.textContent = `Final Score: ${finalScore}`

    const coreDisplay = this.root.querySelector('#stage-clear-cores')!
    coreDisplay.textContent = `+${bossCoresGained} Boss Core${bossCoresGained !== 1 ? 's' : ''}`

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
