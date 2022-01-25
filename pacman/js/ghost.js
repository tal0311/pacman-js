'use strict'

const GHOST = '&#9781;'

var gDeadGhosts = []
var gGhosts = []
var gIntervalGhosts

function createGhost(board) {
  var ghost = {
    location: {
      i: 3,
      j: 3,
    },
    currCellContent: FOOD,
    color: getRandomColor(),
  }
  gGhosts.push(ghost)
  //model
  board[ghost.location.i][ghost.location.j] = GHOST
}

// 3 ghosts and an interval
function createGhosts(board) {
  if (gDeadGhosts.length > 1) gGhosts = []
  createGhost(board)
  createGhost(board)
  createGhost(board)
  gIntervalGhosts = setInterval(moveGhosts, 1000)
}

// loop through ghosts
function moveGhosts() {
  for (var i = 0; i < gGhosts.length; i++) {
    moveGhost(gGhosts[i])
  }
}
function moveGhost(ghost) {
  // figure out moveDiff, nextLocation, nextCell
  // console.log(ghost)

  // if (gPacman.isSuper) {
  //   var ghostlocI = ghost.location.i
  //   var ghostlocj = ghost.location.j
  //   if (ghostlocI === gPacman.location.i && ghostlocj === gPacman.location.j) {
  //     removeGhost(ghost)
  //   }
  // }
  var moveDiff = getMoveDiff()
  var nextLocation = {
    i: ghost.location.i + moveDiff.i,
    j: ghost.location.j + moveDiff.j,
  }
  var nextCellContent = gBoard[nextLocation.i][nextLocation.j]

  // return if cannot move
  if (nextCellContent === WALL) return
  if (nextCellContent === GHOST) return
  // hitting a pacman?  call gameOver
  if (gPacman.isSuper && nextCellContent === PACMAN) {
    getMoveDiff()
    removeGhost(ghost)
  }
  if (nextCellContent === PACMAN) {
    gameOver()
    return
  }

  // update the model
  gBoard[ghost.location.i][ghost.location.j] = ghost.currCellContent
  // update the DOM
  renderCell(ghost.location, ghost.currCellContent)
  // Move the ghost
  ghost.location = nextLocation
  ghost.currCellContent = nextCellContent
  // update the model
  gBoard[ghost.location.i][ghost.location.j] = GHOST
  // update the DOM
  renderCell(ghost.location, getGhostHTML(ghost))
}

function getMoveDiff() {
  var randNum = getRandomIntInclusive(0, 100)
  if (randNum < 25) {
    return { i: 0, j: 1 }
  } else if (randNum < 50) {
    return { i: -1, j: 0 }
  } else if (randNum < 75) {
    return { i: 0, j: -1 }
  } else {
    return { i: 1, j: 0 }
  }
}

function getGhostHTML(ghost) {
  return `<span style="color: ${ghost.color}">${GHOST}</span>`
}

function removeGhost(idx) {
  var removed = gGhosts.splice(idx, 1)[0]
  gBoard[removed.location.i][removed.location.j] =
    removed.currCellContent === FOOD ? FOOD : EMPTY
  getGhostHTML(removed)
  renderCell(removed.location, EMPTY)
  gDeadGhosts.push(removed)
}

function reviveGhosts() {
  for (let i = 0; i < gDeadGhosts.length; i++) {
    var ghost = gDeadGhosts[i]
    gGhosts.push(ghost)
  }
  gDeadGhosts = []
}
