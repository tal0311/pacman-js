'use strict'
const PACMAN = '😷'

var gPacman
function createPacman(board) {
  gPacman = {
    location: {
      i: 6,
      j: 6,
    },
    isSuper: false,
  }
  board[gPacman.location.i][gPacman.location.j] = PACMAN
}

function movePacman(ev) {
  if (!gGame.isOn) return
  // use getNextLocation(), nextCell
  var nextLocation = getNextLocation(ev)
  var nextCellContent = gBoard[nextLocation.i][nextLocation.j]

  // return if cannot move
  if (nextCellContent === WALL) return
  // hitting a ghost?  call gameOver
  if (nextCellContent === GHOST) {
    if (gPacman.isSuper) {
      //TODO: First find the ghost by location then send the ghost.
      var remove = findGhostByLocation(nextLocation)
      removeGhost(remove)
      return
    }
    gameOver()
    return
  }

  if (nextCellContent === FOOD) updateScore(1)
  if (nextCellContent === SUPER) {
    if (gPacman.isSuper) return
    superFood(nextCellContent)
  }
  if (nextCellContent === CHERRY) updateScore(10)
  // update the model
  gBoard[gPacman.location.i][gPacman.location.j] = EMPTY
  // update the DOM
  renderCell(gPacman.location, EMPTY)
  // Move the pacman
  gPacman.location = nextLocation
  // update the model
  gBoard[gPacman.location.i][gPacman.location.j] = PACMAN
  // update the DOM
  renderCell(gPacman.location, PACMAN)
}

function findGhostByLocation(pos) {
  var res = null
  for (let i = 0; i < gGhosts.length; i++) {
    var ghost = gGhosts[i]
    if (ghost.location.i === pos.i && ghost.location.j === pos.j) res = ghost
  }

  return gGhosts.indexOf(res)
}

function superFood() {
  updateScore(100)
  gPacman.isSuper = true

  for (let i = 0; i < gGhosts.length; i++) {
    var ghost = gGhosts[i]
    ghost.color = 'pink'
    getGhostHTML(ghost)
  }

  setTimeout(function () {
    for (let i = 0; i < gGhosts.length; i++) {
      gGhosts[i].color = getRandomColor()
    }
    gPacman.isSuper = false
  }, 5000)
}

function getNextLocation(ev) {
  var nextLocation = {
    i: gPacman.location.i,
    j: gPacman.location.j,
  }
  // figure out nextLocation
  switch (ev.key) {
    case 'ArrowDown':
      nextLocation.i++
      break
    case 'ArrowUp':
      nextLocation.i--
      break
    case 'ArrowLeft':
      nextLocation.j--
      break
    case 'ArrowRight':
      nextLocation.j++
      break
  }

  return nextLocation
}

//transform rotate on the pacman icon
