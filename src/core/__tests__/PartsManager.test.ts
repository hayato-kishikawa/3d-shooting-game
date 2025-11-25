import { describe, it, expect, beforeEach } from 'vitest'
import { PartsManager } from '../PartsManager'

describe('PartsManager', () => {
  let manager: PartsManager

  beforeEach(() => {
    localStorage.clear()
    manager = new PartsManager()
    manager.reset()
  })

  it('initializes with default state', () => {
    expect(manager.getScore()).toBe(0)
    expect(manager.getBossCore()).toBe(0)
    expect(manager.getPartLevel('laser_cannon')).toBe(0)
    expect(manager.getPartLevel('shield_generator')).toBe(0)
  })

  it('adds score correctly', () => {
    manager.addScore(50)
    expect(manager.getScore()).toBe(50)
    manager.addScore(30)
    expect(manager.getScore()).toBe(80)
  })

  it('adds boss cores correctly', () => {
    manager.addBossCore(1)
    expect(manager.getBossCore()).toBe(1)
    manager.addBossCore(2)
    expect(manager.getBossCore()).toBe(3)
  })

  it('gets part definition', () => {
    const part = manager.getPartDefinition('laser_cannon')
    expect(part).toBeDefined()
    expect(part?.id).toBe('laser_cannon')
    expect(part?.category).toBe('weapon')
  })

  it('gets all parts', () => {
    const parts = manager.getAllParts()
    expect(parts.length).toBe(10)
  })

  it('gets current stats for a part', () => {
    const stats = manager.getCurrentStats('laser_cannon')
    expect(stats).toBeDefined()
    expect(stats?.damage).toBe(1)
    expect(stats?.range).toBe(50)
  })

  it('cannot upgrade without sufficient resources', () => {
    const canUpgrade = manager.canUpgrade('laser_cannon')
    expect(canUpgrade).toBe(false)
  })

  it('can upgrade when resources are sufficient', () => {
    manager.addScore(50)
    const canUpgrade = manager.canUpgrade('laser_cannon')
    expect(canUpgrade).toBe(true)
  })

  it('upgrades part successfully', () => {
    manager.addScore(50)
    const success = manager.upgrade('laser_cannon')
    expect(success).toBe(true)
    expect(manager.getPartLevel('laser_cannon')).toBe(1)
    expect(manager.getScore()).toBe(0)
  })

  it('does not upgrade if resources insufficient', () => {
    manager.addScore(20)
    const success = manager.upgrade('laser_cannon')
    expect(success).toBe(false)
    expect(manager.getPartLevel('laser_cannon')).toBe(0)
  })

  it('requires boss cores for level 3 upgrades', () => {
    manager.addScore(1000)
    manager.addBossCore(0)
    manager.upgrade('laser_cannon')
    manager.upgrade('laser_cannon')
    const canUpgradeToLv3 = manager.canUpgrade('laser_cannon')
    expect(canUpgradeToLv3).toBe(false)

    manager.addBossCore(1)
    expect(manager.canUpgrade('laser_cannon')).toBe(true)
  })

  it('resets state correctly', () => {
    manager.addScore(100)
    manager.addBossCore(2)
    manager.upgrade('laser_cannon')
    manager.reset()
    expect(manager.getScore()).toBe(0)
    expect(manager.getBossCore()).toBe(0)
    expect(manager.getPartLevel('laser_cannon')).toBe(0)
  })
})
