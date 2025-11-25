export type HUDOptions = {
  container: HTMLElement
}

export class HUD {
  private readonly root: HTMLDivElement
  private readonly scoreDisplay: HTMLSpanElement
  private readonly hpDisplay: HTMLSpanElement

  private score = 0
  private hp = 100

  constructor(options: HUDOptions) {
    this.root = document.createElement('div')
    this.root.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      padding: 20px;
      pointer-events: none;
      font-family: monospace;
      font-size: 18px;
      color: #fff;
      z-index: 100;
    `

    const scoreLabel = document.createElement('div')
    scoreLabel.style.cssText = `
      margin-bottom: 8px;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
    `
    scoreLabel.innerHTML = 'SCORE: <span id="hud-score">0</span>'

    const hpLabel = document.createElement('div')
    hpLabel.style.cssText = `
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
    `
    hpLabel.innerHTML = 'HP: <span id="hud-hp">100</span>'

    this.root.appendChild(scoreLabel)
    this.root.appendChild(hpLabel)
    options.container.appendChild(this.root)

    this.scoreDisplay = this.root.querySelector('#hud-score')!
    this.hpDisplay = this.root.querySelector('#hud-hp')!
  }

  setScore(value: number): void {
    this.score = Math.max(0, value)
    this.scoreDisplay.textContent = this.score.toString()
  }

  addScore(delta: number): void {
    this.setScore(this.score + delta)
  }

  getScore(): number {
    return this.score
  }

  setHP(value: number): void {
    this.hp = Math.max(0, Math.min(100, value))
    this.hpDisplay.textContent = this.hp.toString()

    // Color feedback based on HP level
    if (this.hp <= 20) {
      this.hpDisplay.style.color = '#ef4444' // red
    } else if (this.hp <= 50) {
      this.hpDisplay.style.color = '#f59e0b' // orange
    } else {
      this.hpDisplay.style.color = '#10b981' // green
    }
  }

  addHP(delta: number): void {
    this.setHP(this.hp + delta)
  }

  getHP(): number {
    return this.hp
  }

  reset(): void {
    this.setScore(0)
    this.setHP(100)
  }

  dispose(): void {
    this.root.remove()
  }
}
