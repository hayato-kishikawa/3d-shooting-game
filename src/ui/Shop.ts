import type { PartsManager } from '../core/PartsManager'
import type { PartCategory, PartDefinition } from '../types/parts'

interface ShopOptions {
  container: HTMLElement
  partsManager: PartsManager
  onClose: () => void
}

export class Shop {
  private readonly root: HTMLDivElement
  private readonly partsManager: PartsManager
  private readonly onClose: () => void
  private visible = false

  constructor(options: ShopOptions) {
    this.partsManager = options.partsManager
    this.onClose = options.onClose
    this.root = this.createShopUI()
    options.container.appendChild(this.root)
  }

  show(): void {
    this.visible = true
    this.root.style.display = 'block'
    this.render()
  }

  hide(): void {
    this.visible = false
    this.root.style.display = 'none'
  }

  isVisible(): boolean {
    return this.visible
  }

  dispose(): void {
    this.root.remove()
  }

  private createShopUI(): HTMLDivElement {
    const root = document.createElement('div')
    root.id = 'shop-overlay'
    root.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      font-family: monospace;
      display: none;
      overflow-y: auto;
      z-index: 1000;
    `
    return root
  }

  private render(): void {
    const categories: PartCategory[] = ['weapon', 'defense', 'mobility', 'special']
    const categoryNames = {
      weapon: '武器 / Weapons',
      defense: '防御 / Defense',
      mobility: '機動 / Mobility',
      special: '特殊 / Special'
    }

    this.root.innerHTML = `
      <div style="padding: 20px; max-width: 1200px; margin: 0 auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
          <h1 style="margin: 0; font-size: 32px; color: #3b82f6;">PARTS SHOP</h1>
          <button id="shop-close-btn" style="
            padding: 10px 20px;
            background: #ef4444;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 18px;
            cursor: pointer;
            font-family: monospace;
          ">CLOSE [ESC]</button>
        </div>

        <div style="margin-bottom: 30px; padding: 15px; background: #1e293b; border-radius: 8px;">
          <span style="font-size: 20px; margin-right: 30px;">Score: <span style="color: #fbbf24;">${this.partsManager.getScore()}</span> pt</span>
          <span style="font-size: 20px;">Boss Cores: <span style="color: #8b5cf6;">${this.partsManager.getBossCore()}</span></span>
        </div>

        ${categories
          .map(
            (category) => `
          <div style="margin-bottom: 40px;">
            <h2 style="color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-bottom: 20px;">
              ${categoryNames[category]}
            </h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
              ${this.renderCategoryParts(category)}
            </div>
          </div>
        `
          )
          .join('')}
      </div>
    `

    const closeBtn = this.root.querySelector('#shop-close-btn') as HTMLButtonElement
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.handleClose())
    }

    this.attachUpgradeListeners()
  }

  private renderCategoryParts(category: PartCategory): string {
    const parts = this.partsManager.getAllParts().filter((p) => p.category === category)
    return parts.map((part) => this.renderPartCard(part)).join('')
  }

  private renderPartCard(part: PartDefinition): string {
    const currentLevel = this.partsManager.getPartLevel(part.id)
    const currentLevelData = part.levels[currentLevel]
    const nextLevel = currentLevel + 1
    const nextLevelData = part.levels[nextLevel]
    const canUpgrade = this.partsManager.canUpgrade(part.id)
    const isMaxLevel = !nextLevelData

    return `
      <div style="background: #1e293b; padding: 15px; border-radius: 8px; border: 2px solid ${isMaxLevel ? '#10b981' : '#475569'};">
        <h3 style="margin: 0 0 5px 0; font-size: 18px; color: #3b82f6;">${part.name}</h3>
        <p style="margin: 0 0 10px 0; font-size: 12px; color: #94a3b8;">${part.nameJP}</p>
        <p style="margin: 0 0 15px 0; font-size: 14px; color: #cbd5e1;">${part.description}</p>

        <div style="margin-bottom: 15px;">
          <div style="font-size: 14px; color: #fbbf24; margin-bottom: 5px;">
            Current Level: ${currentLevel} ${isMaxLevel ? '(MAX)' : ''}
          </div>
          <div style="font-size: 12px; color: #94a3b8;">
            ${currentLevelData?.description ?? 'Not equipped'}
          </div>
        </div>

        ${
          nextLevelData
            ? `
          <div style="border-top: 1px solid #475569; padding-top: 10px; margin-bottom: 10px;">
            <div style="font-size: 14px; color: #10b981; margin-bottom: 5px;">Next Level: ${nextLevel}</div>
            <div style="font-size: 12px; color: #94a3b8; margin-bottom: 8px;">${nextLevelData.description}</div>
            <div style="font-size: 14px; margin-bottom: 5px;">
              Cost: <span style="color: #fbbf24;">${nextLevelData.price}</span> pt
              ${nextLevelData.bossCoreCost > 0 ? ` + <span style="color: #8b5cf6;">${nextLevelData.bossCoreCost}</span> cores` : ''}
            </div>
          </div>

          <button
            data-part-id="${part.id}"
            class="upgrade-btn"
            style="
              width: 100%;
              padding: 10px;
              background: ${canUpgrade ? '#10b981' : '#475569'};
              color: white;
              border: none;
              border-radius: 4px;
              font-size: 16px;
              cursor: ${canUpgrade ? 'pointer' : 'not-allowed'};
              font-family: monospace;
            "
            ${canUpgrade ? '' : 'disabled'}
          >
            ${canUpgrade ? 'UPGRADE' : 'INSUFFICIENT RESOURCES'}
          </button>
        `
            : '<div style="text-align: center; padding: 10px; color: #10b981; font-size: 16px;">MAX LEVEL</div>'
        }
      </div>
    `
  }

  private attachUpgradeListeners(): void {
    const upgradeButtons = this.root.querySelectorAll('.upgrade-btn')
    upgradeButtons.forEach((btn) => {
      const partId = (btn as HTMLElement).dataset.partId
      if (partId) {
        btn.addEventListener('click', () => this.handleUpgrade(partId))
      }
    })
  }

  private handleUpgrade(partId: string): void {
    const success = this.partsManager.upgrade(partId)
    if (success) {
      this.render()
    }
  }

  private handleClose(): void {
    this.hide()
    this.onClose()
  }
}
