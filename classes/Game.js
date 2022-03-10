const Board = require("./Board");
const Settings = require("./Settings");
const AI = require('./AI');
const Node = require('./Node');

class Game {

    #board

    get board() {
        return this.#board
    }

    constructor() {
        this.#board = new Board(Settings.ROWS, Settings.COLS);
    }

    /*
     * Arvotaan käytettävissä olevista sarakkeista satunnainen sarake.
     * - mikäli kaikki sarakkeet ovat käytössä, palauttaa arvon: null
     */
    getRandomCol(){

        let openCols = this.#board.getOpenCols()

        if(openCols.length === 0)
            return null

        //openCols[Math.floor(Math.random()*openCols.length)];
        return openCols[Math.floor(Math.random()*openCols.length)];
    }

    /*
     * Asetetaan pelilaudan tila syöttämällä tehdyt siirrot aikajärjestyksessä.
     * Uusimman siirron jälkeen tarkistetaan onko se voittosiirto.
     *
     * @param piece aloitussiirron tehnyt pelaaja
     * @param moves pelin aikana tehdyt siirrot järjestyksessä
     */
    goThrougMoves(piece, moves){

        let val = null

        for(let x = 0; x < moves.length; x++){

            let ind = moves[x]
            let rc = this.#board.indexToRC(ind)
        
            this.#board.dropThePiece(rc.r, rc.c, piece)

            /*
             * Tarkistetaan onko kyseessä voittosiirto ainoastaan viimeisimmän siirron jälkeen.
             * (Edeltäviltä siirroilta tarkistus on tehty silloin kun ne oliva viimeisimpiä)
             * 
             * @todo: tätäkään ei tarvitsi ennen kuin voitto voisi edes teoriassa olla mahdollista
             */
            if(x === moves.length - 1){
                let winningRow = this.#board.isWinningMove(rc, piece)

                if(winningRow){
            
                    val = {
                        gameIsLive: false,
                        winningRow: winningRow,
                        nextInTurn: null,
                        moves: moves,
                        winner: piece 
                    }
                }
            }
        
            piece = -1 * piece
        }
        
        if(val === null) {

            val = {
                gameIsLive: true,
                winningRow: null,
                nextInTurn: piece === Settings.PLAYER_PIECE ? Settings.PLAYER_TURN : Settings.AI_TURN,
                moves: moves,
                winner: null
            }
        }



        return val
    }

    /*
     * - oletus, että pelipöydällä on vielä tilaa ainakin yhdelle pelimerkill
     */
    makeAIMove(stateOfGame, searchDepth) {

        let debugNode = new Node();

        let val = AI.ABMinValue(
            this.#board, 
            searchDepth, 
            Settings.AI_MAX_SCORE, 
            Settings.PLAYER_MAX_SCORE, 
            debugNode
        );

        let col = val.column;

        //let col = AI.pickBestMove(this.#board, Settings.AI_PIECE)
        
        //Node.TreeWalk(debugNode);
        //console.log("AI", col)
        //let col = this.getRandomCol();  // katso oletus!
        //console.log("Arvottiin: ", col)
        
        let row = this.#board.getNextOpenRow(col)

        let rc = this.#board.rcToIndex(row, col)
        this.#board.dropThePiece(row, col, Settings.AI_PIECE)

        //let winningRow = this.#board.winningMove(Settings.AI_PIECE)
        let winningRow = this.#board.isWinningMove({r: row, c:col}, Settings.AI_PIECE)

        if(winningRow){

            return {
                ...stateOfGame,
                winningRow: winningRow,
                nextInTurn: null,
                moves: stateOfGame.moves.concat(rc),
                winner: Settings.AI_PIECE
            }
        }


        let newStateOfGame = {
            ...stateOfGame,
            nextInTurn: Settings.PLAYER_TURN,
            moves: stateOfGame.moves.concat(rc)
        }

        return newStateOfGame
    }

    /*
     * Tutkitaan pöydän tila pelaajan suorittaman siirron jäljiltä.
     * Mikäli pelaajan järjestyksessä viimeisin siirto ei päättänyt peliä,
     * lasketaan tietokoneen vastaussiirto.
     */
    processMove(request, searchDepth) {

        let turn = request.firstMove === Settings.PLAYER_TURN ? Settings.PLAYER_TURN : Settings.AI_TURN
        let piece = turn === Settings.PLAYER_TURN ? Settings.PLAYER_PIECE : Settings.AI_PIECE

        console.log("- turn", turn, ", piece", piece);


        let moves = request.moves

        let stateOfgame = this.goThrougMoves(piece, moves)

        if(stateOfgame.gameIsLive && stateOfgame.nextInTurn === Settings.AI_TURN)
            return this.makeAIMove(stateOfgame, searchDepth)

        
        return stateOfgame
    }

}

module.exports = Game