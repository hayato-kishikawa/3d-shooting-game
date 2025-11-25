# POR - Strategic Board

- North Star: **3Dシューティングゲームの完成とリリース**（成長システム・ボス戦を含む）; Guardrails: テスト通過必須, `npm run build`成功必須, 200行以下/commit, PeerAは実装禁止
- Non-Goals / Boundaries: モバイル対応は後回し。外部ゲームライブラリ（Phaser等）不使用。3Dモデルは基本図形で代用（アセット作成しない）。

## Deliverables (top-level)
- Phase 1: 基盤構築 - Vite + Three.js環境、ゲームループ - ✅ 完了
- Phase 2: 自機・敵実装 - Player.ts, Enemy.ts, Collision.ts - ✅ 完了
- Phase 2.5: MVG完成 - HUD, Score, GameOver, Restart - 🔄 進行中（PIVOT: 成長システム前に挿入）
- Phase 3: 成長システム - Shop.ts, Upgrade.ts, パーツバランス - PeerB lead, PeerA + Aux 企画
- Phase 4: ボス戦 - Boss攻撃パターン、ステージクリア - PeerB lead, PeerA + Aux 企画
- Phase 5: 仕上げ - UI/UX改善、パフォーマンス最適化 - PeerB lead, PeerA final review

## Bets & Assumptions
- 🔄 Bet 1 (VALIDATING): Three.jsで十分なパフォーマンスが出る | Probe: Phase 1でFPS計測 | Window: Phase 2開始まで
- 🔄 Bet 2 (VALIDATING): 基本図形でも面白いゲームが作れる | Probe: Phase 2で操作感テスト | Window: Phase 3開始まで
- 🔄 Bet 3 (VALIDATING): PeerA + Aux壁打ちでバランス調整が効率化 | Probe: Phase 3でパーツ設計 | Window: Phase 4完了まで

## Roadmap (Now/Next/Later)
- Now (Phase 2.5 - MVG): 🔄 ← 現在ここ
  - [x] Phase 1 & 2完了（Player/Enemy/Collision/全テスト） ✓
  - [ ] HUD.ts - スコア・HP表示（DOM overlay） ← 次
  - [ ] Game.ts拡張 - score/hp管理、敵撃破時score++、衝突時hp--
  - [ ] GameOver.ts - ゲームオーバー画面、リスタートボタン
  - [ ] 敵撃破時の視覚フィードバック
- Next (Phase 3):
  - [ ] パーツバランス設計（PeerA + Aux壁打ち）
  - [ ] Shop.ts - パーツショップUI
  - [ ] Upgrade.ts - 装備・強化ロジック
  - [ ] パーツ効果の実装
- Later (Phase 4-5):
  - [ ] Boss.ts - 攻撃パターン複数、弱点システム
  - [ ] ステージクリア処理
  - [ ] UI/UX改善、パフォーマンス最適化

## Decision & Pivot Log (recent 5)
- 🔄 2025-11-26 06:38 | **PIVOT: Phase 2.5挿入** - HUD/Score/GameOver先行実装→MVG完成優先。成長システムは複雑度高。
- ✅ 2025-11-26 06:41 | POR.md統一: 日本語版に統一、Phase 2.5 roadmap更新 (commit:81440b6)
- ✅ 2025-11-26 06:35 | Phase 2完了: Enemy.test.ts追加、12 tests passing (commit:a9ebac3)
- ✅ 2025-11-26 06:31 | Collision.ts実装完了: 球vs球方式採用、BulletPool/Game.ts統合完了 (commit:d8555db)
- ✅ 2025-11-26 06:20 | PeerA介入: jsdom→happy-dom変更でテスト修正 & Enemy実装承認・コミット (commit:900e40b, 9347f86)

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
| 2 | 自機・敵実装 | PeerB | ✅ 完了 | Player/Enemy/Collision/全テスト完了、12 tests passing (commit:a9ebac3) |
| 2.5 | MVG完成 | PeerB | 🔄 進行中 | POR統一完了 (commit:81440b6); 次: HUD.ts実装開始 |
| 3 | 成長システム | PeerB | ⏳ 待機 | Phase 2.5完了後、パーツバランス設計（Aux壁打ち）から開始 |
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
