import type { PartsManager } from '../core/PartsManager'

export type HUDOptions = {
  container: HTMLElement
  partsManager: PartsManager
}

export class HUD {
  private readonly root: HTMLDivElement
  private readonly scoreDisplay: HTMLSpanElement
  private readonly hpDisplay: HTMLSpanElement
  private readonly partsManager: PartsManager

  private score = 0
  private hp = 100

  constructor(options: HUDOptions) {
    this.partsManager = options.partsManager

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

    const maxHP = this.getMaxHP()

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
    hpLabel.innerHTML = `HP: <span id="hud-hp">${maxHP}</span>`

    this.root.appendChild(scoreLabel)
    this.root.appendChild(hpLabel)
    options.container.appendChild(this.root)

    this.scoreDisplay = this.root.querySelector('#hud-score')!
    this.hpDisplay = this.root.querySelector('#hud-hp')!

    this.hp = maxHP
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
    const maxHP = this.getMaxHP()
    this.hp = Math.max(0, Math.min(maxHP, value))
    this.hpDisplay.textContent = this.hp.toString()

    // Color feedback based on HP percentage
    const hpPercent = maxHP > 0 ? this.hp / maxHP : 0
    if (hpPercent <= 0.2) {
      this.hpDisplay.style.color = '#ef4444' // red
    } else if (hpPercent <= 0.5) {
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
    this.setHP(this.getMaxHP())
  }

  private getMaxHP(): number {
    const shieldStats = this.partsManager.getCurrentStats('shield_generator')
    return shieldStats?.maxHP ?? 100
  }

  dispose(): void {
    this.root.remove()
  }
}
