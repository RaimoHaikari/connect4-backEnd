const Board = require('./classes/Board')
const Keyboard = require('./classes/Keyboard')
const Settings = require('./classes/Settings')

const r = 6
const c = 7

const board = new Board(r,c);
const keyboard = new Keyboard();
let gameOver = false;
let turn = 0;


board.printBoard()
//console.log(board.winningMove(Settings.AI_PIECE))


/*
while (gameOver === false){

    console.log(`....... ${turn} .......`)

    // Ask for Player 1 Input
    if(turn === Settings.PLAYER_TURN){
        let col = keyboard.getMove('PELAAJA 1: Valitse sarake?')

        if(board.isValidLocation(col)){
            let row = board.getNextOpenRow(col)
            board.dropThePiece(row, col,Settings.PLAYER_PIECE )

            if(board.winningMove(Settings.PLAYER_PIECE)){
                console.log("Pelaaja 1 Voitti!")
                gameOver = true
            }
        }

    }
    else {
        let col = keyboard.getMove('PELAAJA 2: Valitse sarake?')

        if(board.isValidLocation(col)){
            let row = board.getNextOpenRow(col)
            board.dropThePiece(row, col,Settings.AI_PIECE)

            if(board.winningMove(Settings.AI_PIECE)){
                console.log("Pelaaja 2 Voitti!")
                gameOver = true
            }

        }   
    }

    // Tulostetaan pliltilanne
    board.printBoard()

    // Vaihdetaan vuoro
    turn++;
    turn = turn % 2;

}
*/