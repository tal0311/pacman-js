'use strict'
const WALL = '⬜'
const FOOD = '◽'
const EMPTY = ' '
const SUPER = '🌮'
const CHERRY = '🍒'

var gBoard
var gGame = {
  score: 0,
  isOn: false,
}

var gReviveGhostsInterval
var gCherryInterval
var gIsFood
// init()
function init() {
  var elGameOver = document.querySelector('.modal')
  elGameOver.classList.add('hidden')
  var elScore = document.querySelector('h2 span')
  elScore.innerText = 0
  gBoard = buildBoard()
  createGhosts(gBoard)
  createPacman(gBoard)

  gCherryInterval = setInterval(() => {
    var cherryPos = getCherryLocation(gBoard)
    gBoard[cherryPos.i][cherryPos.j] = CHERRY
    renderCell(cherryPos, CHERRY)
  }, 15000)
  printMat(gBoard, '.board-container')

  gDeadGhosts = []
  gReviveGhostsInterval = setInterval(function () {
    if (gDeadGhosts.length >= 1) {
      reviveGhosts()
    }
  }, 5000)
  gGame.isOn = true
}

function buildBoard() {
  var SIZE = 10
  var board = []
  for (var i = 0; i < SIZE; i++) {
    board.push([])
    for (var j = 0; j < SIZE; j++) {
      board[i][j] = FOOD
      if (
        i === 0 ||
        i === SIZE - 1 ||
        j === 0 ||
        j === SIZE - 1 ||
        (j === 3 && i > 4 && i < SIZE - 2)
      ) {
        board[i][j] = WALL
      }
    }
  }

  board[1][1] = SUPER
  board[1][board.length - 2] = SUPER
  board[board.length - 2][1] = SUPER
  board[board.length - 2][board.length - 2] = SUPER

  return board
}

// update model and dom
function updateScore(diff) {
  // model
  gGame.score += diff

  //dom
  var elScore = document.querySelector('h2 span')
  elScore.innerText = gGame.score

  // checkFood
  if (!isFood(gBoard)) {
    gGame.isOn = false
    victorias()
    return
  }
}

// TODO

function gameOver() {
  gGame.isOn = false
  clearInterval(gIntervalGhosts)

  gIntervalGhosts = null
  clearInterval(gCherryInterval)
  gCherryInterval = null
  clearTimeout(gReviveGhostsInterval)
  gReviveGhostsInterval = null
  var elGameOver = document.querySelector('.modal')
  elGameOver.classList.remove('hidden')
}

function isFood(board) {
  var foodCount = 0
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      if (board[i][j] === FOOD) foodCount++
    }
  }
  return foodCount > 1 ? true : false
}

function victorias() {
  clearInterval(gIntervalGhosts)
  gIntervalGhosts = null
  clearInterval(gCherryInterval)
  gCherryInterval = null
  var elGameOver = document.querySelector('.modal')
  var elH3 = document.querySelector('.modal h3')
  elGameOver.classList.remove('hidden')
  elH3.innerText = 'Victorious - all food collected '
}

// var cherryPos = getCherryLocation(gBoard)
// setInterval(renderCell, 1000, cherryPos, CHERRY)

function getCherryLocation() {
  var locations = []
  for (let i = 0; i < gBoard.length; i++) {
    for (let j = 0; j < gBoard[0].length; j++) {
      if (gBoard[i][j] === FOOD || gBoard[i][j] === EMPTY) {
        var location = {
          i: i,
          j: j,
        }

        locations.push(location)
      }
    }
  }
  if (locations.length)
    return locations[getRandomIntInclusive(0, locations.length - 1)]
  else return null
}
