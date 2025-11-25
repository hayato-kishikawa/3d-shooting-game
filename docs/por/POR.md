# POR - Strategic Board

- North Star: **3Dシューティングゲームの完成とリリース**（成長システム・ボス戦を含む）; Guardrails: テスト通過必須, `npm run build`成功必須, 200行以下/commit, PeerAは実装禁止
- Non-Goals / Boundaries: モバイル対応は後回し。外部ゲームライブラリ（Phaser等）不使用。3Dモデルは基本図形で代用（アセット作成しない）。

## Deliverables (top-level)
- Phase 1: 基盤構築 - Vite + Three.js環境、ゲームループ - ✅ 完了
- Phase 2: 自機・敵実装 - Player.ts, Enemy.ts, Collision.ts - ✅ 完了
- Phase 2.5: MVG完成 - HUD, Score, GameOver, Restart - ✅ 完了 (commit:f666564)
- Phase 3.1-3.3: 成長システム基礎 - PartsManager, Shop, 基本パーツ効果 - ✅ 完了 (commit:fe2c1ba)
- Phase 3.4: 成長システム拡張 - 残り7パーツ実装 - ⏳ 保留 (Phase 4完了後)
- Phase 4.1: 基本ボス - HP50, 20killトリガー, UI - ✅ 完了 (commit:0617b4f)
- Phase 4.2: 中ボス - HP120, 50killトリガー - 🔄 次タスク
- Phase 4.3: 最終ボス - HP250, 100killトリガー - ⏳ 待機
- Phase 5: 仕上げ - UI/UX改善、パフォーマンス最適化 - ⏳ 待機

## Bets & Assumptions
- 🔄 Bet 1 (VALIDATING): Three.jsで十分なパフォーマンスが出る | Probe: Phase 1でFPS計測 | Window: Phase 2開始まで
- 🔄 Bet 2 (VALIDATING): 基本図形でも面白いゲームが作れる | Probe: Phase 2で操作感テスト | Window: Phase 3開始まで
- 🔄 Bet 3 (VALIDATING): PeerA + Aux壁打ちでバランス調整が効率化 | Probe: Phase 3でパーツ設計 | Window: Phase 4完了まで

## Roadmap (Now/Next/Later)
- Completed (Phase 1-4.1): ✅
  - [x] Phase 1 & 2完了（Player/Enemy/Collision/全テスト）
  - [x] Phase 2.5完了（HUD/Score/HP/GameOver/Restart） - commit:f666564
  - [x] Phase 3.1完了（PartsManager + partsData.ts、10パーツ定義） - commit:5385729
  - [x] Phase 3.2完了（Shop UI、Sキーでトグル） - commit:7d25d6e
  - [x] Phase 3.3完了（基本3パーツ効果: laser_cannon, shield_generator, booster） - commit:fe2c1ba
  - [x] Phase 4.0完了（インフラ: kill counter, BossHealthBar, StageClear, Collision.test.ts） - commits:8d9547f-6fccd50
  - [x] Phase 4.1完了（基本ボス: HP50, 20killトリガー, 狙い撃ち, ボス弾） - commit:0617b4f, 47 tests
- Now (Phase 4.2 - 中ボス): 🔄 ← 現在ここ
  - [ ] Boss拡張: 中ボス "Destroyer" (HP120, 50killトリガー)
  - [ ] 攻撃パターン強化（3-way shot等）
  - [ ] Boss.test.ts拡張
- Next (Phase 4.3):
  - [ ] 最終ボス "Annihilator" (HP250, 100killトリガー)
  - [ ] 高度な攻撃パターン（チャージ攻撃等）
- Later (Phase 3.4, 5):
  - [ ] 残り7パーツ実装（multi_shot, homing_missile等）
  - [ ] UI/UX改善、パフォーマンス最適化

## Decision & Pivot Log (recent 5)
- ✅ 2025-11-26 07:35 | Phase 4.1完了承認: Boss統合LGTM、47 tests passing、Phase 4.2（攻撃パターン）へ (commit:0617b4f)
- ✅ 2025-11-26 07:20 | Phase 4.0-4.1完了: Collision.test.ts, Boss infrastructure, Boss実装完了 (commits:8d9547f-0617b4f)
- ✅ 2025-11-26 07:05 | Phase 3.3完了: 基本3パーツ効果実装（Option A採用） (commit:fe2c1ba)
- ✅ 2025-11-26 06:58 | Phase 3.1-3.2完了: PartsManager + Shop UI実装、24 tests passing (commit:7d25d6e)
- ✅ 2025-11-26 06:38 | **PIVOT: Phase 2.5挿入** - HUD/Score/GameOver先行実装→MVG完成優先 (commit:81440b6)

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
| 2.5 | MVG完成 | PeerB | ✅ 完了 | HUD/GameOver/Restart実装完了 (commit:f666564) |
| 3.1-3.3 | 成長システム基礎 | PeerB | ✅ 完了 | PartsManager/Shop/基本パーツ3種実装、34 tests (commit:fe2c1ba) |
| 3.4 | 成長システム拡張 | PeerB | ⏳ 保留 | Phase 4完了後実装 |
| 4.0 | Boss インフラ | PeerB | ✅ 完了 | Kill counter/UI/Collision tests (commits:8d9547f-6fccd50) |
| 4.1 | 基本ボス | PeerB | ✅ 完了 | Boss実装・統合完了、47 tests passing (commit:0617b4f) |
| 4.2 | 攻撃パターン | PeerB | 🔄 進行中 | 次: 3-way弾幕・突進攻撃追加 |
| 4.3 | 中・最終ボス | PeerB | ⏳ 待機 | Phase 4.2完了後 |
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
