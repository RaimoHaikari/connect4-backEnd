const Settings = require('../Settings')

/*
 * How to Program a Connect 4 AI (implementing the minimax algorithm)
 * Keith Galli
 * - https://www.youtube.com/watch?v=MMLtza3CZFM
 */
class Galli {

    /*
     * Erilaisten yhdistelmien pisteytys
     */
    static getWindowScore(isPiece, isFree, isOpponent) {

        //console.log(`-> ${isPiece} ${isFree} ${isOpponent} [in getWindowScore]`)

        if(isPiece === Settings.WINNING_LENGTH)
            return 100
        
        if(isPiece === Settings.WINNING_LENGTH - 1 && isFree === 1)
            return 5

        if(isPiece === Settings.WINNING_LENGTH - 2 && isFree === Settings.WINNING_LENGTH - 2)
            return 2

        if(isOpponent === Settings.WINNING_LENGTH -1 && isFree === 1)
            return -4

        return 0
    }


    static scoreAscending(board, piece) {

        //console.log("sAsc:", piece)
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

                let windowScore = Galli.getWindowScore(isPiece, isFree, isOpponent)

                //console.log(arr, windowScore)

                score = score + windowScore

            }

        }


        return score
    }

    /*
     * Keskiriviä kannattaa arvottaa muita rivejä paremmin, koska
     * se parantaa mahdollisuuksia diagonaalisten suorien muodostamiseen
     * 
     * - @param col keskimmäisen sarakkeen indeksinumero
     */
    static scoreCenter(board, piece, col) {

        let score = 0
        let arr = []

        for(let indY = 0; indY < board.rows; indY++){

            if(board.getMark(indY, col) === piece){
                score = score + Settings.PIECE_IN_CENTER_COL
            }

            //arr.push(board.rcToIndex(indY, col))

        }

        //console.log(arr)

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

                score = score + Galli.getWindowScore(isPiece, isFree, isOpponent)

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
                    //arr.push(board.rcToIndex(row, indX));
                    
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

                

                score = score + Galli.getWindowScore(isPiece, isFree, isOpponent)
                //console.log(arr,':',isPiece, isFree, isOpponent,"[",Galli.getWindowScore(isPiece, isFree, isOpponent));

            }

        }

        return score

    }

    static scorePosition(board, piece) {

        let score = 0
        let cScore = 0

        if(board.cols % 2 === 1){
            cScore = Galli.scoreCenter(board, piece, board.center)
            score = score + cScore
        }

        let hScore = Galli.scoreHorizontal(board, piece)
        score = score + hScore

        let vScore = Galli.scoreVertical(board, piece)
        score = score + vScore

        let dScore = Galli.scoreDescending(board, piece)
        score = score + dScore

        let aScore = Galli.scoreAscending(board, piece)
        score = score + aScore


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

                score = score + Galli.getWindowScore(isPiece, isFree, isOpponent)

            }

        } 

        return score
    }

}

module.exports = Galli;