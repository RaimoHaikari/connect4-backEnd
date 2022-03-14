const Settings = require('../Settings')

/*
 * How should I design a good evaluation function for Connect 4?
 * - https://stackoverflow.com/questions/10985000/how-should-i-design-a-good-evaluation-function-for-connect-4
 */
class deSmet {

    /*
     * Käydään läpi nousevat diagonaalit
     */
    static scoreAscending (board) {

        let score = {}
        score[Settings.AI_PIECE] = 0;
        score[Settings.PLAYER_PIECE] = 0;

        for(let row = board.rows - 1; row >= (Settings.WINNING_LENGTH-1); row--){

            for(let col = 0;  col < Settings.WINNING_LENGTH; col++) {

                //let arr = []

                let ai_can_win = true;
                let player_can_win = true;

                for(let delta = 0; delta < Settings.WINNING_LENGTH; delta++){

                    let indY = row - delta
                    let indX = col + delta

                    //arr.push(board.rcToIndex(indY, indX));

                    switch (board.getMark(indY, indX)) {

                        case Settings.PLAYER_PIECE:
                            ai_can_win = false
                            break;

                        case Settings.AI_PIECE:
                            player_can_win = false
                            break;

                    }                    

                    if(ai_can_win === false & player_can_win === false)
                        break;

                }

                //console.log(arr);

                if(player_can_win) {
                    score[Settings.PLAYER_PIECE] = score[Settings.PLAYER_PIECE] + 1
                }

                if(ai_can_win) {
                    score[Settings.AI_PIECE] = score[Settings.AI_PIECE] + 1
                }

            }

        }


        return score
    }


    /*
     * Käydään läpi laskevat diagonaalit
     */
    static scoreDescending (board) {

        let score = {}
        score[Settings.AI_PIECE] = 0;
        score[Settings.PLAYER_PIECE] = 0;

        for(let row = 0; row <= (board.rows - Settings.WINNING_LENGTH); row++){

            for(let col = 0; col < Settings.WINNING_LENGTH; col++){

                //let arr = []

                let ai_can_win = true;
                let player_can_win = true;

                // - tutkitaan mitä voittosuoran mittaisessa ikkunassa on...
                for(let delta = 0; delta < Settings.WINNING_LENGTH; delta++){

                    let indY = row + delta
                    let indX = col + delta

                    //arr.push(board.rcToIndex(indY, indX));

                    switch (board.getMark(indY, indX)) {

                        case Settings.PLAYER_PIECE:
                            ai_can_win = false
                            break;

                        case Settings.AI_PIECE:
                            player_can_win = false
                            break;

                    }

                    if(ai_can_win === false & player_can_win === false)
                        break;
                }

                //console.log(arr);

                if(player_can_win) {
                    score[Settings.PLAYER_PIECE] = score[Settings.PLAYER_PIECE] + 1
                }

                if(ai_can_win) {
                    score[Settings.AI_PIECE] = score[Settings.AI_PIECE] + 1
                }

            }
        }

        return score

    }


    /*
     * Tutkitaan pöydän sisältämän vaakasuorat linjat
     */
    static scoreHorizontal(board) {

        let score = {}
        score[Settings.PLAYER_PIECE] = 0;
        score[Settings.AI_PIECE] = 0;


        // Score horizontal
        for(let row = 0; row < board.rows; row++){

            for(let col = 0; col < Settings.WINNING_LENGTH; col++){

                //let arr = []

                let ai_can_win = true;
                let player_can_win = true;

                for(let deltaC = 0; deltaC < Settings.WINNING_LENGTH; deltaC++){

                    let indX = col+deltaC;
                    //arr.push(board.rcToIndex(row, indX));

                    switch (board.getMark(row, indX)) {

                        case Settings.PLAYER_PIECE:
                            ai_can_win = false
                            break;

                        case Settings.AI_PIECE:
                            player_can_win = false
                            break
                    
                    }

                    if(ai_can_win === false & player_can_win === false)
                        break
                
                }

                if(player_can_win) {
                    score[Settings.PLAYER_PIECE] = score[Settings.PLAYER_PIECE] + 1
                }

                if(ai_can_win) {
                    score[Settings.AI_PIECE] = score[Settings.AI_PIECE] + 1
                }

            }

        }

        return score

    }


    static scorePosition(board, piece) {

        let score = {}
        score[Settings.AI_PIECE] = 0;
        score[Settings.PLAYER_PIECE] = 0;

        let hScore = deSmet.scoreHorizontal(board);
        let vScore = deSmet.scoreVertical(board);
        let dScore = deSmet.scoreDescending(board);
        let aScore = deSmet.scoreAscending(board);

        score[Settings.AI_PIECE] = 
            hScore[Settings.AI_PIECE] +
            vScore[Settings.AI_PIECE] +
            dScore[Settings.AI_PIECE] +
            aScore[Settings.AI_PIECE];

        score[Settings.PLAYER_PIECE] = 
            hScore[Settings.PLAYER_PIECE] +
            vScore[Settings.PLAYER_PIECE] +
            dScore[Settings.PLAYER_PIECE] +
            aScore[Settings.PLAYER_PIECE];



        console.log(hScore);
        console.log(vScore);
        console.log(dScore);
        console.log(aScore);

        console.log(score);

        /*
        let cScore = 0



        let hScore = AI.scoreHorizontal(board, piece)
        score = score + hScore

        let vScore = AI.scoreVertical(board, piece)
        score = score + vScore

        let dScore = AI.scoreDescending(board, piece)
        score = score + dScore

        let aScore = AI.scoreAscending(board, piece)
        score = score + aScore

        //console.log("[", cScore, hScore, vScore, dScore, aScore, "]")
        */

        return score
    }

    /*
     * Scannataan pelipöydän tilanne pystysuorien rivien kannalta
     */
    static scoreVertical(board) {

        //console.log(`.. in scoreVertical`)

        let score = {}
        score[Settings.AI_PIECE] = 0;
        score[Settings.PLAYER_PIECE] = 0;

        // Score horizontal
        for(let indX = 0; indX < board.cols; indX++){

            for(let row = 0; row <= (board.rows - Settings.WINNING_LENGTH); row++){

                //let arr = []

                let ai_can_win = true;
                let player_can_win = true;

                // - muodostetaan voittosuoran mittainen ikkuna
                for(let deltaR = 0; deltaR < Settings.WINNING_LENGTH; deltaR++){

                    let indY = row+deltaR
                    //arr.push(board.rcToIndex(indY, indX));       


                    switch (board.getMark(indY, indX)) {

                        case Settings.PLAYER_PIECE:
                            ai_can_win = false
                            break;

                        case Settings.AI_PIECE:
                            player_can_win = false
                            break;
                    
                    }

                    if(ai_can_win === false & player_can_win === false)
                        break

                    //arr.push(board.rcToIndex(indY, indX))
                }

                if(player_can_win) {
                    score[Settings.PLAYER_PIECE] = score[Settings.PLAYER_PIECE] + 1
                }

                if(ai_can_win) {
                    score[Settings.AI_PIECE] = score[Settings.AI_PIECE] + 1
                }

                //console.log(arr)

            }

        }

        return score;

    }

}

module.exports = deSmet;