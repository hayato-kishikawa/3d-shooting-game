import type { PartDefinition } from '../types/parts'

export const PARTS_DATA: PartDefinition[] = [
  // Weapon Category
  {
    id: 'laser_cannon',
    name: 'Laser Cannon',
    nameJP: 'レーザーキャノン',
    category: 'weapon',
    description: '射程距離と弾速を強化する基本武器',
    levels: [
      {
        level: 0,
        price: 0,
        bossCoreCost: 0,
        stats: { damage: 1, range: 50, bulletSpeed: 40 },
        description: '初期装備'
      },
      {
        level: 1,
        price: 50,
        bossCoreCost: 0,
        stats: { damage: 1, range: 60, bulletSpeed: 40 },
        description: '射程距離+20%'
      },
      {
        level: 2,
        price: 120,
        bossCoreCost: 0,
        stats: { damage: 1, range: 70, bulletSpeed: 52 },
        description: '射程距離+40%、弾速+30%'
      },
      {
        level: 3,
        price: 250,
        bossCoreCost: 1,
        stats: { damage: 2, range: 80, bulletSpeed: 60 },
        description: 'ダメージ2倍、射程距離+60%、弾速+50%'
      },
      {
        level: 4,
        price: 500,
        bossCoreCost: 3,
        stats: { damage: 2, range: 90, bulletSpeed: 70 },
        description: '射程距離+80%、弾速+75%'
      }
    ]
  },
  {
    id: 'multi_shot',
    name: 'Multi-Shot',
    nameJP: 'マルチショット',
    category: 'weapon',
    description: '連射速度・同時発射数を上げる',
    levels: [
      {
        level: 0,
        price: 0,
        bossCoreCost: 0,
        stats: { fireInterval: 0.18, bulletCount: 1, spreadAngle: 0 },
        description: '未装備'
      },
      {
        level: 1,
        price: 80,
        bossCoreCost: 0,
        stats: { fireInterval: 0.144, bulletCount: 1, spreadAngle: 0 },
        description: '連射速度-20%'
      },
      {
        level: 2,
        price: 180,
        bossCoreCost: 0,
        stats: { fireInterval: 0.117, bulletCount: 1, spreadAngle: 0 },
        description: '連射速度-35%'
      },
      {
        level: 3,
        price: 350,
        bossCoreCost: 1,
        stats: { fireInterval: 0.144, bulletCount: 2, spreadAngle: 15 },
        description: '2連射、左右から発射'
      },
      {
        level: 4,
        price: 700,
        bossCoreCost: 3,
        stats: { fireInterval: 0.12, bulletCount: 3, spreadAngle: 20 },
        description: '3連射、連射速度-33%'
      }
    ]
  },
  {
    id: 'homing_missile',
    name: 'Homing Missile',
    nameJP: 'ホーミングミサイル',
    category: 'weapon',
    description: '追尾機能付き特殊武器',
    levels: [
      {
        level: 0,
        price: 0,
        bossCoreCost: 0,
        stats: { turnRate: 0, fireInterval: 2.0, damage: 1, lockRange: 0 },
        description: '未装備'
      },
      {
        level: 1,
        price: 150,
        bossCoreCost: 0,
        stats: { turnRate: 2.0, fireInterval: 2.0, damage: 1, lockRange: 30 },
        description: 'ホーミング発動（低精度）'
      },
      {
        level: 2,
        price: 300,
        bossCoreCost: 0,
        stats: { turnRate: 3.5, fireInterval: 1.5, damage: 1, lockRange: 40 },
        description: 'ホーミング精度UP、1.5秒間隔'
      },
      {
        level: 3,
        price: 500,
        bossCoreCost: 2,
        stats: { turnRate: 5.0, fireInterval: 1.2, damage: 2, lockRange: 50 },
        description: 'ホーミング高精度、ダメージ2倍'
      },
      {
        level: 4,
        price: 1000,
        bossCoreCost: 3,
        stats: { turnRate: 7.0, fireInterval: 1.0, damage: 3, lockRange: 60 },
        description: 'ホーミング最高精度、ダメージ3倍、1秒間隔'
      }
    ]
  },
  // Defense Category
  {
    id: 'shield_generator',
    name: 'Shield Generator',
    nameJP: 'シールドジェネレーター',
    category: 'defense',
    description: '最大HPを増やす',
    levels: [
      {
        level: 0,
        price: 0,
        bossCoreCost: 0,
        stats: { maxHP: 100 },
        description: '初期HP'
      },
      {
        level: 1,
        price: 60,
        bossCoreCost: 0,
        stats: { maxHP: 120 },
        description: 'HP+20'
      },
      {
        level: 2,
        price: 140,
        bossCoreCost: 0,
        stats: { maxHP: 150 },
        description: 'HP+50'
      },
      {
        level: 3,
        price: 280,
        bossCoreCost: 1,
        stats: { maxHP: 200 },
        description: 'HP+100'
      },
      {
        level: 4,
        price: 560,
        bossCoreCost: 3,
        stats: { maxHP: 250 },
        description: 'HP+150'
      }
    ]
  },
  {
    id: 'armor_plate',
    name: 'Armor Plate',
    nameJP: 'アーマープレート',
    category: 'defense',
    description: '被ダメージ軽減',
    levels: [
      {
        level: 0,
        price: 0,
        bossCoreCost: 0,
        stats: { damageReduction: 0 },
        description: '未装備'
      },
      {
        level: 1,
        price: 70,
        bossCoreCost: 0,
        stats: { damageReduction: 0.2 },
        description: 'ダメージ軽減20%'
      },
      {
        level: 2,
        price: 160,
        bossCoreCost: 0,
        stats: { damageReduction: 0.35 },
        description: 'ダメージ軽減35%'
      },
      {
        level: 3,
        price: 320,
        bossCoreCost: 1,
        stats: { damageReduction: 0.5 },
        description: 'ダメージ軽減50%'
      },
      {
        level: 4,
        price: 640,
        bossCoreCost: 3,
        stats: { damageReduction: 0.65 },
        description: 'ダメージ軽減65%'
      }
    ]
  },
  {
    id: 'auto_repair',
    name: 'Auto-Repair',
    nameJP: 'オートリペア',
    category: 'defense',
    description: 'HP自動回復',
    levels: [
      {
        level: 0,
        price: 0,
        bossCoreCost: 0,
        stats: { healInterval: 0, healAmount: 0 },
        description: '未装備'
      },
      {
        level: 1,
        price: 100,
        bossCoreCost: 0,
        stats: { healInterval: 5, healAmount: 5 },
        description: '5秒ごとに+5 HP回復'
      },
      {
        level: 2,
        price: 220,
        bossCoreCost: 0,
        stats: { healInterval: 4, healAmount: 8 },
        description: '4秒ごとに+8 HP回復'
      },
      {
        level: 3,
        price: 450,
        bossCoreCost: 2,
        stats: { healInterval: 3, healAmount: 12 },
        description: '3秒ごとに+12 HP回復'
      },
      {
        level: 4,
        price: 900,
        bossCoreCost: 3,
        stats: { healInterval: 2.5, healAmount: 15 },
        description: '2.5秒ごとに+15 HP回復'
      }
    ]
  },
  // Mobility Category
  {
    id: 'booster',
    name: 'Booster',
    nameJP: 'ブースター',
    category: 'mobility',
    description: '移動速度アップ',
    levels: [
      {
        level: 0,
        price: 0,
        bossCoreCost: 0,
        stats: { moveSpeed: 12 },
        description: '初期移動速度'
      },
      {
        level: 1,
        price: 40,
        bossCoreCost: 0,
        stats: { moveSpeed: 14.4 },
        description: '移動速度+20%'
      },
      {
        level: 2,
        price: 100,
        bossCoreCost: 0,
        stats: { moveSpeed: 16.8 },
        description: '移動速度+40%'
      },
      {
        level: 3,
        price: 200,
        bossCoreCost: 1,
        stats: { moveSpeed: 19.2 },
        description: '移動速度+60%'
      },
      {
        level: 4,
        price: 400,
        bossCoreCost: 3,
        stats: { moveSpeed: 21.6 },
        description: '移動速度+80%'
      }
    ]
  },
  {
    id: 'quick_turn',
    name: 'Quick Turn',
    nameJP: 'クイックターン',
    category: 'mobility',
    description: '旋回速度・照準速度アップ',
    levels: [
      {
        level: 0,
        price: 0,
        bossCoreCost: 0,
        stats: { aimLerp: 0.35 },
        description: '初期照準速度'
      },
      {
        level: 1,
        price: 50,
        bossCoreCost: 0,
        stats: { aimLerp: 0.5 },
        description: '照準速度+43%'
      },
      {
        level: 2,
        price: 110,
        bossCoreCost: 0,
        stats: { aimLerp: 0.65 },
        description: '照準速度+86%'
      },
      {
        level: 3,
        price: 230,
        bossCoreCost: 1,
        stats: { aimLerp: 0.8 },
        description: '照準速度+129%'
      },
      {
        level: 4,
        price: 460,
        bossCoreCost: 3,
        stats: { aimLerp: 0.9 },
        description: '照準速度+157%'
      }
    ]
  },
  // Special Category
  {
    id: 'score_booster',
    name: 'Score Booster',
    nameJP: 'スコアブースター',
    category: 'special',
    description: '獲得スコア倍率UP',
    levels: [
      {
        level: 0,
        price: 0,
        bossCoreCost: 0,
        stats: { scoreMultiplier: 1.0 },
        description: '未装備'
      },
      {
        level: 1,
        price: 90,
        bossCoreCost: 0,
        stats: { scoreMultiplier: 1.3 },
        description: 'スコア倍率1.3x'
      },
      {
        level: 2,
        price: 200,
        bossCoreCost: 0,
        stats: { scoreMultiplier: 1.6 },
        description: 'スコア倍率1.6x'
      },
      {
        level: 3,
        price: 400,
        bossCoreCost: 1,
        stats: { scoreMultiplier: 2.0 },
        description: 'スコア倍率2.0x'
      },
      {
        level: 4,
        price: 800,
        bossCoreCost: 3,
        stats: { scoreMultiplier: 2.5 },
        description: 'スコア倍率2.5x'
      }
    ]
  },
  {
    id: 'shield_recharge',
    name: 'Shield Recharge',
    nameJP: 'シールドリチャージ',
    category: 'special',
    description: 'ダメージ無しで一定時間経過後、シールド再生',
    levels: [
      {
        level: 0,
        price: 0,
        bossCoreCost: 0,
        stats: { rechargeCooldown: 0, rechargePercent: 0 },
        description: '未装備'
      },
      {
        level: 1,
        price: 120,
        bossCoreCost: 0,
        stats: { rechargeCooldown: 5, rechargePercent: 0.3 },
        description: '5秒無傷で30%シールド回復'
      },
      {
        level: 2,
        price: 260,
        bossCoreCost: 0,
        stats: { rechargeCooldown: 4, rechargePercent: 0.5 },
        description: '4秒無傷で50%シールド回復'
      },
      {
        level: 3,
        price: 520,
        bossCoreCost: 2,
        stats: { rechargeCooldown: 3, rechargePercent: 0.8 },
        description: '3秒無傷で80%シールド回復'
      },
      {
        level: 4,
        price: 1040,
        bossCoreCost: 3,
        stats: { rechargeCooldown: 2, rechargePercent: 1.0 },
        description: '2秒無傷で100%シールド回復'
      }
    ]
  }
]
