import './style.css'
import { Game } from './core/Game'

const root = document.querySelector<HTMLDivElement>('#app')

if (!root) {
  throw new Error('Failed to find #app container')
}

const canvasHost = document.createElement('div')
canvasHost.className = 'game-surface'
root.appendChild(canvasHost)

const game = new Game({ container: canvasHost })
game.start()

if (import.meta.hot) {
  import.meta.hot.accept()
  import.meta.hot.dispose(() => {
    game.dispose()
    canvasHost.remove()
  })
}
