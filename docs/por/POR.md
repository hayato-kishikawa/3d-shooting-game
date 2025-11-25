# POR - Strategic Board

- North Star: **3Dシューティングゲームの完成とリリース**（成長システム・ボス戦を含む）; Guardrails: テスト通過必須, `npm run build`成功必須, 200行以下/commit, PeerAは実装禁止
- Non-Goals / Boundaries: モバイル対応は後回し。外部ゲームライブラリ（Phaser等）不使用。3Dモデルは基本図形で代用（アセット作成しない）。

## Deliverables (top-level)
- Phase 1: 基盤構築 - Vite + Three.js環境、ゲームループ - PeerB lead, PeerA review
- Phase 2: 自機・敵実装 - Player.ts, Enemy.ts, Collision.ts - PeerB lead, PeerA review
- Phase 3: 成長システム - Shop.ts, Upgrade.ts, パーツバランス - PeerB lead, PeerA + Aux 企画
- Phase 4: ボス戦 - Boss攻撃パターン、ステージクリア - PeerB lead, PeerA + Aux 企画
- Phase 5: 仕上げ - UI/UX改善、パフォーマンス最適化 - PeerB lead, PeerA final review

## Bets & Assumptions
- 🔄 Bet 1 (VALIDATING): Three.jsで十分なパフォーマンスが出る | Probe: Phase 1でFPS計測 | Window: Phase 2開始まで
- 🔄 Bet 2 (VALIDATING): 基本図形でも面白いゲームが作れる | Probe: Phase 2で操作感テスト | Window: Phase 3開始まで
- 🔄 Bet 3 (VALIDATING): PeerA + Aux壁打ちでバランス調整が効率化 | Probe: Phase 3でパーツ設計 | Window: Phase 4完了まで

## Roadmap (Now/Next/Later)
- Now (Phase 2): 🔄 ← 現在ここ
  - [x] Vite + TypeScript + Three.js環境構築 ✓
  - [x] 基本的な3Dシーン表示 ✓
  - [x] ゲームループの実装 ✓
  - [x] 操作感の方針決定（PeerA + Aux壁打ち）→ Twin-stick ✓
  - [x] カメラアングルの決定（PeerA + Aux壁打ち）→ 斜め見下ろし55度 ✓
  - [x] Player.ts WASD移動実装 ✓
  - [x] Player.ts 射撃実装（Bullet pool） ✓
  - [x] Vitestセットアップ（vitest.config.ts + vitest.setup.ts + happy-dom） ✓
  - [x] Player.test.ts - 移動範囲制限テスト ✓
  - [x] BulletPool.test.ts - 弾の発射・回収テスト ✓
  - [x] Enemy.ts - 通常敵出現パターン ✓
  - [x] Collision.ts - 3D衝突判定（弾vs敵、プレイヤーvs敵） ✓
  - [x] Enemy.test.ts - 敵spawn/deactivateテスト ✓
- Next (Phase 2-3): ← 次
  - [ ] スコア・HP表示 (HUD.ts)
  - [ ] ゲームオーバー処理
  - [ ] Shop.ts - パーツショップUI
  - [ ] Upgrade.ts - 装備・強化ロジック
- Later (Phase 4-5):
  - [ ] Boss.ts - 攻撃パターン複数、弱点システム
  - [ ] ステージクリア処理
  - [ ] UI/UX改善（HUD、ゲームオーバー画面）
  - [ ] パフォーマンス最適化

## Decision & Pivot Log (recent 5)
- ✅ 2025-11-26 06:35 | Enemy.test.ts完了: 8テスト追加（spawn/deactivate/sway検証）、12 tests passing (commit:a9ebac3)
- ✅ 2025-11-26 06:31 | Collision.ts実装完了: 球vs球方式採用、BulletPool/Game.ts統合完了 (commit:d8555db)
- ✅ 2025-11-26 06:20 | PeerA介入: jsdom→happy-dom変更でテスト修正 & Enemy実装承認・コミット (commit:900e40b, 9347f86)
- ⚠️ 2025-11-26 06:19 | Process violation: PeerB 7h未コミット & Phase 2先行実装。品質は良好だが手順違反。
- ✅ 2025-11-25 23:14 | Phase 1（移動・射撃）完了。LGTM。Vitestセットアップ最優先→テスト後Phase 2へ

## Risk Radar & Mitigations
| リスク | 影響 | 確率 | 対策 |
|--------|------|------|------|
| R1: Three.js学習コスト | 高 | 中 | 公式ドキュメント参照、シンプルな実装から開始 |
| R2: パフォーマンス問題 | 中 | 中 | オブジェクト数制限、LOD検討、早期FPS計測 |
| R3: バランス調整難航 | 中 | 中 | Auxとの壁打ちで早期に詰める |
| R4: 衝突判定の複雑化 | 中 | 低 | 球vsボックスのシンプルな判定に限定 |

## Portfolio Health
| Phase | Title | Owner | Stage | Latest evidence |
|-------|-------|-------|-------|-----------------|
| 1 | 基盤構築 | PeerB | ✅ 完了 | Player移動・射撃・BulletPool実装済 (commit:c595e46) |
| 1.5 | テスト基盤 | PeerA | ✅ 完了 | Vitest+happy-dom, 4 tests passing (commit:900e40b) |
| 2 | 自機・敵実装 | PeerB | ✅ 完了 | Enemy.test.ts完了 (commit:a9ebac3); 12 tests passing |
| 3 | 成長システム | PeerB | ⏳ 待機 | - |
| 4 | ボス戦 | PeerB | ⏳ 待機 | - |
| 5 | 仕上げ | PeerB | ⏳ 待機 | - |

## Operating Principles
- **エビデンス駆動**: テスト結果・ビルド成功なしの「完了」は無効
- **小さく分割**: 200行以下/commit、段階的実装
- **相互レビュー**: PeerB実装 → PeerAレビュー必須
- **壁打ち活用**: 企画・バランスで迷ったらAuxに相談
- **Done = tested + reviewed + committed**

## Maintenance & Change Log
- ⏳ 開始待ち | プロジェクト初期化

## Aux Delegations（PeerAからの壁打ち依頼）
- [x] 操作感の方針（キーボードvsマウス）→ Twin-stick (WASD+マウス)
- [x] カメラアングル（見下ろし型 vs TPS視点）→ 斜め見下ろし55度
- [ ] パーツバランス設計（強化段階数、各パーツの効果）
- [ ] ボス攻撃パターン設計

## Aux Delegations - Meta-Review/Revise (strategic)
Strategic only: list meta-review/revise items offloaded to Aux.
Keep each item compact: what (one line), why (one line), optional acceptance.
Tactical Aux subtasks now live in each SUBPOR under 'Aux (tactical)'; do not list them here.
After integrating Aux results, either remove the item or mark it done.
- [ ] <meta-review — why — acceptance(optional)>
- [ ] <revise — why — acceptance(optional)>
