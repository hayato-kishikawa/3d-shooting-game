export type BossHealthBarOptions = {
  container: HTMLElement
}

export class BossHealthBar {
  private readonly root: HTMLDivElement
  private readonly barFill: HTMLDivElement
  private readonly bossName: HTMLDivElement
  private maxHP = 0
  private currentHP = 0
  private visible = false

  constructor(options: BossHealthBarOptions) {
    this.root = document.createElement('div')
    this.root.style.cssText = `
      position: absolute;
      top: 60px;
      left: 50%;
      transform: translateX(-50%);
      width: 60%;
      display: none;
      font-family: monospace;
      z-index: 200;
    `

    this.bossName = document.createElement('div')
    this.bossName.style.cssText = `
      text-align: center;
      color: #fff;
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 8px;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
      letter-spacing: 2px;
    `
    this.bossName.textContent = 'BOSS'

    const barContainer = document.createElement('div')
    barContainer.style.cssText = `
      width: 100%;
      height: 20px;
      background: rgba(0, 0, 0, 0.7);
      border: 2px solid #dc2626;
      border-radius: 10px;
      overflow: hidden;
      position: relative;
    `

    this.barFill = document.createElement('div')
    this.barFill.style.cssText = `
      height: 100%;
      width: 100%;
      background: linear-gradient(90deg, #dc2626, #ef4444);
      transition: width 0.3s ease-out;
      border-radius: 8px;
    `

    barContainer.appendChild(this.barFill)
    this.root.appendChild(this.bossName)
    this.root.appendChild(barContainer)
    options.container.appendChild(this.root)
  }

  show(maxHP: number, name = 'BOSS'): void {
    this.maxHP = maxHP
    this.currentHP = maxHP
    this.bossName.textContent = name
    this.barFill.style.width = '100%'
    this.root.style.display = 'block'
    this.visible = true
  }

  update(currentHP: number): void {
    if (!this.visible) {
      return
    }

    this.currentHP = Math.max(0, currentHP)
    const hpPercent = this.maxHP > 0 ? (this.currentHP / this.maxHP) * 100 : 0
    this.barFill.style.width = `${hpPercent}%`
  }

  hide(): void {
    this.root.style.display = 'none'
    this.visible = false
  }

  isVisible(): boolean {
    return this.visible
  }

  dispose(): void {
    this.root.remove()
  }
}
