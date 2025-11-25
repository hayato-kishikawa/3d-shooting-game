# 3D Shooting Game

A browser-based 3D shooting game built with Three.js and TypeScript, featuring a progression system, multiple boss encounters, and upgradeable parts.

## Features

- **3D Combat**: Twin-stick shooter controls in a 3D environment with WASD movement and mouse aiming
- **5-Stage Upgrade System**: Enhance your ship through 5 levels (Lv.0 → Lv.4) with score and boss core requirements
- **3 Boss Encounters**: Face progressively challenging bosses (Dreadnought, Destroyer, Annihilator) with unique attack patterns
- **4 Upgradeable Parts**:
  - **Laser Cannon**: Increased damage, range, and bullet speed
  - **Multi-Shot**: Twin/triple cannons with enhanced fire rate
  - **Shield Generator**: Improved max HP and damage reduction
  - **Booster**: Enhanced movement speed
- **Boss Core Economy**: Defeat bosses to earn cores for final-tier upgrades
- **Comprehensive Testing**: 66 unit tests ensuring gameplay stability

## Demo

Clone and run locally to play (GitHub Pages deployment coming soon).

## Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser to http://localhost:5173
```

## Controls

| Input | Action |
|-------|--------|
| **WASD** | Move ship |
| **Mouse** | Aim direction |
| **Space / Left Click** | Fire weapons |
| **S** | Toggle parts shop |

## Gameplay

1. **Survive & Score**: Destroy enemies to earn points
2. **Upgrade**: Press `S` to open the shop and spend points on part upgrades
3. **Boss Battles**: Defeat bosses at 20, 50, and 100 kills to earn boss cores
4. **Final Tier**: Use boss cores to unlock Level 4 upgrades (requires 3 cores from Annihilator)

## Tech Stack

- **TypeScript 5.9**: Strict mode for type safety
- **Three.js 0.181**: 3D rendering and physics
- **Vite 7.2**: Fast build tool and dev server
- **Vitest 4.0**: Unit testing framework
- **happy-dom**: DOM testing environment

## Build

```bash
# Run tests
npm test

# Production build
npm run build

# Preview production build
npm run preview
```

## Development

The project follows a modular architecture:

- `src/core/`: Game logic (Player, Enemy, Boss, Collision, PartsManager)
- `src/graphics/`: Three.js rendering (Renderer, BulletPool, EnemyPool)
- `src/ui/`: User interface (HUD, Shop, GameOver)
- `src/data/`: Game configuration (partsData)

All core systems have comprehensive test coverage.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Author

[hayato-kishikawa](https://github.com/hayato-kishikawa)
