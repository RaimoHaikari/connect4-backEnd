const AI = require("./classes/AI")
const Board = require('./classes/Board')
const Keyboard = require('./classes/Keyboard')
const Settings = require('./classes/Settings')
const Node = require('./classes/Node')

const board = new Board(Settings.ROWS, Settings.COLS);
const keyboard = new Keyboard();
let gameOver = false;

/*
 * Arvotaan kumpi aloittaa
 */ 
//let rnd = Math.floor(Math.random() * 2)
//let turn = [Settings.PLAYER_TURN, Settings.AI_TURN][rnd];
let turn  = Settings.AI_TURN

board.printBoard()


const getRandomCol = () => {
    let openCols = board.getOpenCols()

    if(openCols.length === 0)
        return null

    return openCols[Math.floor(Math.random()*openCols.length)]
}


while (gameOver === false){

    //console.log(`....... ${turn} .......`)

    // Ask for Player 1 Input
    if(turn === Settings.PLAYER_TURN){
        let col = keyboard.getMove('PELAAJA 1: Valitse sarake?')

        if(col === null)
            break

        if(board.isValidLocation(col)){
            let row = board.getNextOpenRow(col)
            board.dropThePiece(row, col,Settings.PLAYER_PIECE )

            if(board.isWinningMove({r: row, c:col}, Settings.PLAYER_PIECE)){
            //if(board.winningMove(Settings.PLAYER_PIECE)){
                console.log("Pelaaja 1 Voitti!")
                gameOver = true
            }
        }
        

    }
    else {

        let seconds = 1

        /* Pieni tauko ennen tietokoneen siirtoa */
        console.log("PELAAJA 2: miettii.....")
        var waitTill = new Date(new Date().getTime() + seconds * 250);
        while(waitTill > new Date()){}

        // let col = keyboard.getMove('PELAAJA 2: Valitse sarake?')
        //let col = getRandomCol()
        //let col = AI.pickBestMove(board, Settings.AI_PIECE)
        //let val = AI.minmax(board,1,Settings.AI_TURN)

        let debugNode = new Node();
        //let val = AI.MinValue(board, 4, debugNode)
        let val = AI.ABMinValue(
            board, 
            2, 
            Settings.AI_MAX_SCORE, 
            Settings.PLAYER_MAX_SCORE, 
            debugNode)
        Node.TreeWalk(debugNode)

        let col = val.column

        if(col == null)
            break

        if(board.isValidLocation(col)){

            let row = board.getNextOpenRow(col)
            board.dropThePiece(row, col,Settings.AI_PIECE)
            console.log(`.................................`)

            if(board.isWinningMove({r: row, c:col}, Settings.AI_PIECE)){
            //if(board.winningMove(Settings.AI_PIECE)){
                console.log("Pelaaja 2 Voitti!")
                gameOver = true
            }

        }
    }

    // Tulostetaan pliltilanne
    board.printBoard()

    // Vaihdetaan vuoro
    // turn = -1 * turn
    turn++;
    turn = turn % 2;

}
