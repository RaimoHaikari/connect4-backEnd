const Game = require('./classes/Game');

const game = new Game();
const board = game.board;

let gameOver = false;

let request = {
    firstMove: 1,
    moves: [38,]
};

/*
let searchDepth = 1;

let val = game.processMove(request, searchDepth);
//console.log(".................")
console.log(val);
console.log("nextInTurn:", val.nextInTurn);
console.log("moves:", val.moves)
*/
//board.printBoard();

const sortInt = (a,b) => {
    return a - b;
}

var numArray = [140000, 104, 99];

numArray.sort(sortInt);

console.log(numArray);