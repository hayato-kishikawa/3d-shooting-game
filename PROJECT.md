# 3D Shooting Game

## Overview
Browser-based 3D shooting game built with Three.js and TypeScript. The player controls a spacecraft on an endless runway, aiming with mouse and moving with WASD keys.

## Tech Stack
- **Runtime**: Browser (ES2022)
- **Language**: TypeScript 5.9
- **Build**: Vite 7.2
- **3D Engine**: Three.js 0.181
- **Physics**: (Planned) Rapier3D

## Project Structure
```
src/
├── main.ts           # Entry point, game initialization
├── style.css         # Global styles
├── core/
│   ├── Game.ts       # Main game loop, scene management
│   └── Player.ts     # Player entity, input handling
└── graphics/
    ├── Camera.ts     # Third-person camera controller
    └── Renderer.ts   # WebGL renderer wrapper
```

## Current State
Phase 1 complete: Basic game loop, player movement, camera following, scrolling runway.

## Commands
- `npm run dev` - Development server with HMR
- `npm run build` - Production build
- `npm run preview` - Preview production build
