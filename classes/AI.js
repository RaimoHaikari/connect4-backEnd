const Settings = require('./Settings')

class AI {

    /*
     * Erilaisten yhdistelmien pisteytys
     */
    static getWindowScore(isPiece, isFree, isOpponent) {

        if(isPiece === Settings.WINNING_LENGTH)
            return 100
        
        if(isPiece === Settings.WINNING_LENGTH - 1 && isFree === 1)
            return 10

        if(isPiece === Settings.WINNING_LENGTH - 2 && isFree === Settings.WINNING_LENGTH - 2)
            return 3

        if(isOpponent === Settings.WINNING_LENGTH -1 && isFree === 1)
            return -80

        return 0
    }

    /*
     * BRUTE FORCE
     * - testataan jokaista vapaana olevaa vaihtoehtoa
     */
    static pickBestMove(board, piece) {

        //console.log("........ pickBestMove ............")

        let col;
        let row;

        let validLocations = board.getOpenCols()

        let bestScore = -Infinity
        // - arvotaan oletukseksi jokin mahdollisista sarakkeista
        // let bestCol = validLocations[Math.floor(Math.random()*validLocations.length)] 
        let bestCol = null 

        for(let index = 0; index < validLocations.length; index++){
            
            col = validLocations[index]
            row = board.getNextOpenRow(col)

            board.dropThePiece(row, col, piece)

            let score = AI.scorePosition(board, piece)

            console.log(`c: ${col}: ${score}`)

            if(score > bestScore){
                bestScore = score
                bestCol = col
            }

            board.removeThePiece(row, col)

        }

        return bestCol
    }
    

    static scoreAscending(board, piece) {
        let score = 0;

        for(let row = board.rows - 1; row >= (Settings.WINNING_LENGTH-1); row--){
            for(let col = 0;  col < Settings.WINNING_LENGTH; col++) {

               let arr = []

               let isPiece = 0
               let isFree = 0
               let isOpponent = 0

                for(let delta = 0; delta < Settings.WINNING_LENGTH; delta++){

                    let indY = row - delta
                    let indX = col + delta

                    switch (board.getMark(indY, indX)) {

                        case piece:
                            isPiece++
                            break;

                        case Settings.FREE:
                            isFree++
                            break

                        default:
                            isOpponent++;
                    }                    

                    //arr.push(board.rcToIndex(indY, indX))

                }

                score = score + AI.getWindowScore(isPiece, isFree, isOpponent)

            }

        }


        return score
    }

    /*
     * Käydään läpi laskevat diagonaalit
     */
    static scoreDescending(board, piece) {

        let score = 0

        for(let row = 0; row <= (board.rows - Settings.WINNING_LENGTH); row++){

            for(let col = 0; col < Settings.WINNING_LENGTH; col++){

                //let arr = []

                let isPiece = 0
                let isFree = 0
                let isOpponent = 0

                for(let delta = 0; delta < Settings.WINNING_LENGTH; delta++){

                    let indY = row + delta
                    let indX = col + delta

                    switch (board.getMark(indY, indX)) {

                        case piece:
                            isPiece++
                            break;

                        case Settings.FREE:
                            isFree++
                            break
                    
                        default:
                            isOpponent++;
                    }

                    //arr.push(board.rcToIndex(indY, indX))
                }

                score = score + AI.getWindowScore(isPiece, isFree, isOpponent)

            }
        }

        return score

    }

    /*
     * Tutkitaan pöydän sisältämän vaakasuorat linjat
     */
    static scoreHorizontal(board, piece) {

        let score = 0

        // Score horizontal
        for(let row = 0; row < board.rows; row++){

            for(let col = 0; col < Settings.WINNING_LENGTH; col++){

                //let arr = []

                let isPiece = 0
                let isFree = 0
                let isOpponent = 0

                for(let deltaC = 0; deltaC < Settings.WINNING_LENGTH; deltaC++){

                    let indX = col+deltaC

                    
                    switch (board.getMark(row, indX)) {

                        case piece:
                            isPiece++
                            break;

                        case Settings.FREE:
                            isFree++
                            break
                    
                        default:
                            isOpponent++;
                    }
                
                }

                score = score + AI.getWindowScore(isPiece, isFree, isOpponent)

            }

        }

        return score

    }



    /*
     * Scannataan pelipöydän tilanne pystysuorien rivien kannalta
     */
    static scoreVertical(board, piece) {

        //console.log(`.. in scoreVertical`)
        let score = 0

        // Score horizontal
        for(let indX = 0; indX < board.cols; indX++){

            for(let row = 0; row <= (board.rows - Settings.WINNING_LENGTH); row++){

                //let arr = []

                let isPiece = 0
                let isFree = 0
                let isOpponent = 0

                for(let deltaR = 0; deltaR < Settings.WINNING_LENGTH; deltaR++){
                    let indY = row+deltaR

                    switch (board.getMark(indY, indX)) {

                        case piece:
                            isPiece++
                            break;

                        case Settings.FREE:
                            isFree++
                            break
                    
                        default:
                            isOpponent++;
                    }

                    //arr.push(board.rcToIndex(indY, indX))
                }

                score = score + AI.getWindowScore(isPiece, isFree, isOpponent)

            }

        } 

        return score
    }

    /*
     * Keskiriviä kannattaa arvottaa muita rivejä paremmin, koska
     * se parantaa mahdollisuuksia diagonaalisten suorien muodostamiseen
     */
    static scoreCenter(board, piece, col) {

        let score = 0
        //let arr = []

        for(let indY = 0; indY < board.rows; indY++){

            if(board.getMark(indY, col) === piece){
                score = score + Settings.PIECE_IN_CENTER_COL
            }

            //let mark = board.getMark(indY, col)
            //arr.push(board.rcToIndex(indY, col))
            //arr.push(mark)
        }

        //console.log(arr)

        return score

    }


    static scorePosition(board, piece) {

        let score = 0

        if(board.cols % 2 === 1) 
            score = score + AI.scoreCenter(board, piece, Math.floor(board.cols/2))

        let hScore = AI.scoreHorizontal(board, piece)
        score = score + hScore

        let vScore = AI.scoreVertical(board, piece)
        score = score + vScore

        let dScore = AI.scoreDescending(board, piece)
        score = score + dScore

        let aScore = AI.scoreAscending(board, piece)
        score = score + aScore

        return score
    }

    /*
     *
     */
    static getRandomCol(board){

        let openCols = board.getOpenCols()

        if(openCols.length === 0)
            return null

        return openCols[Math.floor(Math.random()*openCols.length)];
    }
}

module.exports = AI