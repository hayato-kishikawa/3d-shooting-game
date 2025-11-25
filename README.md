# 3D Shooting Game

A 3D shooting game built with Three.js and TypeScript featuring upgradeable parts system and boss battles.

## Features

- 3D space shooter with WASD + mouse controls
- Enemy spawning and scoring system
- 5-level upgrade system (Lv.0-4) with boss core requirements
- 3 unique boss encounters (Dreadnought, Destroyer, Annihilator)
- 4 functional parts: Laser Cannon, Multi-Shot, Shield Generator, Booster
- Parts shop system

## Getting Started

### Prerequisites

- Node.js 18+ required

### Installation & Running Locally

```bash
# Clone the repository
git clone https://github.com/hayato-kishikawa/3d-shooting-game.git
cd 3d-shooting-game

# Install dependencies
npm install

# Run development server
npm run dev

# Open browser at http://localhost:5173
```

### Build for Production

```bash
npm run build
npm run preview
```

### Run Tests

```bash
npm test
```

## Controls

- **WASD**: Move player
- **Mouse**: Aim direction
- **Space / Click**: Fire bullets
- **S**: Toggle parts shop

## Tech Stack

- TypeScript 5.9 (strict mode)
- Three.js 0.181
- Vite 7.2
- Vitest 4.0

## Project Structure

```
src/
  core/       # Game logic
  ui/         # UI components
  data/       # Parts definitions
  types/      # TypeScript types
```

## Tests

- 66 tests passing (100%)
- Coverage: Player, Boss, Enemy, Collision, PartsManager

## License

MIT
