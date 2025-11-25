# 3D Shooting Game

A 3D shooting game built with Three.js and TypeScript featuring upgradeable parts system and boss battles.

## Features

- 3D space shooter with WASD + mouse controls
- Enemy spawning and scoring system
- 5-level upgrade system (Lv.0-4) with boss core requirements
- 3 unique boss encounters (Dreadnought, Destroyer, Annihilator)
- 4 functional parts: Laser Cannon, Multi-Shot, Shield Generator, Booster
- Parts shop system

## Prerequisites

- **Node.js 20.19+ or 22+** (required by Vite 7.2)

### Installing Node.js

**Using nvm (recommended):**
```bash
# Install nvm if you haven't already
# See: https://github.com/nvm-sh/nvm

# Install Node.js 22
nvm install 22
nvm use 22
nvm alias default 22
```

**Direct installation:**
Download from [nodejs.org](https://nodejs.org/) and install Node.js 22 LTS.

**Verify installation:**
```bash
node --version  # Should show v22.x.x
```

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/hayato-kishikawa/3d-shooting-game.git
cd 3d-shooting-game
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```

### 4. Open in browser
Navigate to [http://localhost:5173](http://localhost:5173)

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

## Troubleshooting

### "Vite requires Node.js version 20.19+ or 22.12+" error

If you see this error when running `npm run dev`:
```
You are using Node.js X.X.X.
Vite requires Node.js version 20.19+ or 22.12+.
```

**Solution:** Your Node.js version is too old. Please upgrade to Node.js 22 using the installation instructions in the [Prerequisites](#prerequisites) section above.

**Quick fix with nvm:**
```bash
nvm install 22
nvm use 22
npm run dev
```

## License

MIT
