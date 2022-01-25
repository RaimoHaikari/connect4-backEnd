const Game = require('./classes/Game')

const game = new Game()
const board = game.board

let gameOver = false;

let request = {
    firstMove: 0,
    moves: [35,38,28,37,41]
    //       1 -1  1
}

let val = game.processMove(request)
//console.log(".................")
console.log(val)
board.printBoard()