const Settings = require('./Settings')
const Node = require('./Node')

class AI {


    /*
     *
     */
    static getRandomCol(board){

        let openCols = board.getOpenCols()

        if(openCols.length === 0)
            return null

        return openCols[Math.floor(Math.random()*openCols.length)];
    }

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

    /*
     * Peli päättyy mikäli:
     * - jompikumpi pelaajista voittaa
     * - jäljellä ei ole enää vapaita ruutuja
     */
    static isTerminalNode(board){

        if(board.winningMove(Settings.PLAYER_PIECE))
            return {
                terminalNode: true,
                winningPiece: Settings.PLAYER_PIECE
            }
        
        if(board.winningMove(Settings.AI_PIECE))
            return {
                terminalNode: true,
                winningPiece: Settings.AI_PIECE
            }

        if(board.getOpenCols().length === 0)
            return {
                terminalNode: true,
                winningPiece: undefined
            }

        return {
            terminalNode: false,
            winningPiece: undefined
        }

    }

    /*
     * Tutkitaan ollaanko saavutettu lopputila.
     *
     * Peli loppuu mikäli jompikumpi pelaaja voittaa pelin tai on saavutettu rekursion maksimisyvyys.
     * 
     * @param board pelilaudan tila
     * @param depth rekursion syvyys
     * @param piece kumman pelaajan kannalta pelitilannetta arvioidaan
     */
    static GoalTest(board, depth, piece) {

        let gameState = AI.isTerminalNode(board);

        //console.log(`...........GoalTest [${piece}]............`)

        
        // Vaihtoehto 1: Päättyikö peli voittoon tai tasapeliin?
        if(gameState.terminalNode){

            /*
            console.log("TERMINAL NODE!")
            board.printBoard()
            console.log("......................................")
            */

            if(gameState.winningPiece === Settings.PLAYER_PIECE){
                return {
                    score: Settings.PLAYER_MAX_SCORE,
                    column: undefined
                };
            }
            else if(gameState.winningPiece === Settings.AI_PIECE){
                return {
                    score: Settings.AI_MAX_SCORE,
                    column: undefined
                };
            }
            else {
                return {
                    score: Settings.DRAW_SCORE,
                    column: undefined
                };
            }
        } 

        // Vaihtoehto 2: saavutetiinko maksimisyvyys?
        if(depth === 0) {

            let coef = piece === Settings.AI_PIECE ? -1 : 1

            let s = AI.scorePosition(
                board, 
                piece
            )

            /*
            console.log("DEPTH == 0")
            board.printBoard()
            console.log(`.........${s} * ${coef} = ${coef * s}...........`)
            */


            return {
                score: coef * s,
                column: undefined
            }
        }

        /*
        console.log("PASS")
        board.printBoard()
        console.log("......................................")
        */

        return {
            score: undefined,
            column: undefined
        }

    }

    /*
     * Haetaan PELAAJAN kannalta parasta siirtoa
     *
     * Pelaajan kannalta siirto on sitä parempi, mitä suurempi pelipöydän tilaa arvioiva 
     * luku on.
     * 
     * MaxValue funktion toiminta jakaantuu kahteen osaan
     * 
     * Vaihe 1: 
     * 
     * Tutkitaan pelipöydän tilanne TIETOKONEEN edellisen siirron jäljiltä
     * - Päättyykö peli TIETOKONEEN siirtoon? Joko niin, että kyseessä oli tietokoneen voittoon 
     *   johtanut siirto tai ko. siirron jälkeen ei ole enään vapaita peliruutuja
     * - Saavutettiinko rekursiosyvyys? Mikäli näin tapahtui, palautetaan arvio 
     *   pelilaudan tilasta 
     * 
     * Mikäli kumpikaan em. vaihtoehdoista ei toteutunut.
     * 
     * - Vaihe 2: käydään läpi pelaajan siirtovaihtoehdot. 
    
     */
    static ABMaxValue(board, depth, alpha, beta, node) {

        // - vaihe 1: saavutettiinko lopputila?
        let gameState = AI.GoalTest(board, depth, Settings.AI_PIECE);

        if(typeof gameState.score !== 'undefined')
            return gameState

        // - vaihe 2: käydään läpi pelaajan siirtovaihtoehdot

        /*
         * Vaihe 2: käydään läpi TIETOKONEEN:n siirtovaihtoehdot
         *
         * - tavoitteena on mahdollisimman suuri pelitilanteen arvioluku
         * - lähdetään parantamaan mahdollisimman huonoa tilannetta, jossa AI olisi voittanut
         */
        let validLocations = board.getOpenColsCenter();

        let bestScore = Settings.AI_MAX_SCORE;  
        let bestCol = null;

        let piece = Settings.PLAYER_PIECE;

        for(let index = 0; index < validLocations.length; index++){
        
            let col = validLocations[index]
            let row = board.getNextOpenRow(col)
            let n = new Node(col, node)

            board.dropThePiece(row, col, piece)

            let val = AI.ABMinValue(board, depth-1, alpha, beta, n)
            n.value = val.score

            if(val.score > bestScore){
                bestScore = val.score
                bestCol = col
            }

            node.addChild(n)
            board.removeThePiece(row, col)

            /* 
             * Alpha–beta pruning
             * - mikä on oikea kohta koodissa...
             */
            if(val.score >= beta){
                n.bruningMsg = `${val.score} >= ${beta}`
                break
            }

            if(val.score > alpha)
                alpha = val.score

        }

        //console.log(`${intent} > ${bestScore} [${bestCol}]`)
        node.value = bestScore
        node.selection = 'max'

        return {
            score: bestScore,
            column: bestCol,
        }
    }

    /*
     * Haetaan AI:n kannalta parasta siirtoa
     * 
     * 
     */
    static ABMinValue(board, depth, alpha, beta, node) {

        // - vaihe 1: missä tilassa ollaan PELAAJAN tekemän siirron jälkeen?
        let gameState = AI.GoalTest(board, depth, Settings.PLAYER_PIECE);

        if(typeof gameState.score !== 'undefined')
            return gameState

        /*
         * Vaihe 2: käydään läpi AI:n siirtovaihtoehdot
         * - tavoite mahdollisimmna pieni pelitilanteen arvioluku
         * - asetetaan lähtötilanteeksi PELAAJAN kannalta parhaan siirron arvo,
         *   jota sitten yritetään saada TIETOKONEEN kannalta pienemmäksi
         */
        let validLocations = board.getOpenColsCenter();

        let bestScore = Settings.PLAYER_MAX_SCORE;
        let bestCol = null;

        let piece = Settings.AI_PIECE;

        for(let index = 0; index < validLocations.length; index++){
        
            let col = validLocations[index]
            let row = board.getNextOpenRow(col)
            let n = new Node(col, node)

            //console.log(`${intent} DROPPED ${col}`)
            board.dropThePiece(row, col, piece)

            let val = AI.ABMaxValue(board, depth-1, alpha, beta, n)
            n.value = val.score
            //console.log(`${intent} ${col} ${val.score}`)

            if(val.score < bestScore){
                bestScore = val.score
                bestCol = col
            }

            node.addChild(n)
            board.removeThePiece(row, col)

            /* 
             * Alpha–beta pruning
             * - mikä on oikea kohta koodissa...
             */
            if(val.score <= alpha){
                n.bruningMsg = `${val.score} <= ${alpha}`
                break
            }

            if(val.score < beta)
                beta = val.score

        }

        node.value = bestScore
        node.selection = 'min'
        //console.log(`${intent} > ${bestScore} [${bestCol}]`)

        return {
            score: bestScore,
            column: bestCol,
        }
        
    }


    /*
     * Haetaan PELAAJAN kannalta parasta siirtoa
     *
     * Pelaajan kannalta siirto on sitä parempi, mitä suurempi pelipöydän tilaa arvioiva 
     * luku on.
     * 
     * MaxValue funktion toiminta jakaantuu kahteen osaan
     * 
     * Vaihe 1: 
     * 
     * Tutkitaan pelipöydän tilanne TIETOKONEEN edellisen siirron jäljiltä
     * - Päättyykö peli TIETOKONEEN siirtoon? Joko niin, että kyseessä oli tietokoneen voittoon 
     *   johtanut siirto tai ko. siirron jälkeen ei ole enään vapaita peliruutuja
     * - Saavutettiinko rekursiosyvyys? Mikäli näin tapahtui, palautetaan arvio 
     *   pelilaudan tilasta 
     * 
     * Mikäli kumpikaan em. vaihtoehdoista ei toteutunut.
     * 
     * - Vaihe 2: käydään läpi pelaajan siirtovaihtoehdot. 
    
     */
    static MaxValue(board, depth, node) {

        // - vaihe 1: saavutettiinko lopputila?
        let gameState = AI.GoalTest(board, depth, Settings.AI_PIECE);

        if(typeof gameState.score !== 'undefined')
            return gameState

        // - vaihe 2: käydään läpi pelaajan siirtovaihtoehdot

        /*
         * Vaihe 2: käydään läpi TIETOKONEEN:n siirtovaihtoehdot
         *
         * - tavoitteena on mahdollisimman suuri pelitilanteen arvioluku
         * - lähdetään parantamaan mahdollisimman huonoa tilannetta, jossa AI olisi voittanut
         */
        let validLocations = board.getOpenColsCenter();

        let bestScore = Settings.AI_MAX_SCORE;  
        let bestCol = null;

        let piece = Settings.PLAYER_PIECE;

        for(let index = 0; index < validLocations.length; index++){
        
            let col = validLocations[index]
            let row = board.getNextOpenRow(col)
            let n = new Node(col, node)

            //console.log(`${intent} DROPPED ${col}`)
            board.dropThePiece(row, col, piece)

            let val = AI.MinValue(board, depth-1, n)
            n.value = val.score
            //console.log(`${intent} ${col} ${val.score}`)

            if(val.score > bestScore){
                bestScore = val.score
                bestCol = col
            }

            node.addChild(n)
            board.removeThePiece(row, col)

        }

        //console.log(`${intent} > ${bestScore} [${bestCol}]`)
        node.value = bestScore
        node.selection = 'max'

        return {
            score: bestScore,
            column: bestCol,
        }
    }

    /*
     * Haetaan AI:n kannalta parasta siirtoa
     * 
     * 
     */
    static MinValue(board, depth, node) {

        // - vaihe 1: missä tilassa ollaan PELAAJAN tekemän siirron jälkeen?
        let gameState = AI.GoalTest(board, depth, Settings.PLAYER_PIECE);

        if(typeof gameState.score !== 'undefined')
            return gameState

        /*
         * Vaihe 2: käydään läpi AI:n siirtovaihtoehdot
         * - tavoite mahdollisimmna pieni pelitilanteen arvioluku
         * - asetetaan lähtötilanteeksi PELAAJAN kannalta parhaan siirron arvo,
         *   jota sitten yritetään saada TIETOKONEEN kannalta pienemmäksi
         */
        let validLocations = board.getOpenColsCenter();

        let bestScore = Settings.PLAYER_MAX_SCORE;
        let bestCol = null;

        let piece = Settings.AI_PIECE;

        for(let index = 0; index < validLocations.length; index++){
        
            let col = validLocations[index]
            let row = board.getNextOpenRow(col)
            let n = new Node(col, node)

            //console.log(`${intent} DROPPED ${col}`)
            board.dropThePiece(row, col, piece)

            let val = AI.MaxValue(board, depth-1, n)
            n.value = val.score
            //console.log(`${intent} ${col} ${val.score}`)

            if(val.score < bestScore){
                bestScore = val.score
                bestCol = col
            }

            node.addChild(n)
            board.removeThePiece(row, col)

        }

        node.value = bestScore
        node.selection = 'min'
        //console.log(`${intent} > ${bestScore} [${bestCol}]`)

        return {
            score: bestScore,
            column: bestCol,
        }
        
    }



    /*
     * BRUTE FORCE
     * - testataan jokaista vapaana olevaa vaihtoehtoa
     * 
     * @todo: Älä poista! Käyttöä, jos innostuu tekemään opasvideon.
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

            //console.log(`c: ${col}: ${score}`)

            if(score > bestScore){
                bestScore = score
                bestCol = col
            }

            board.removeThePiece(row, col)

        }

        return bestCol
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

                let windowScore = AI.getWindowScore(isPiece, isFree, isOpponent)

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
     *
     */
    static scorePosition(board, piece) {

        let score = 0
        let cScore = 0

        if(board.cols % 2 === 1){
            cScore = AI.scoreCenter(board, piece, board.center)
            score = score + cScore
        }

        let hScore = AI.scoreHorizontal(board, piece)
        score = score + hScore

        let vScore = AI.scoreVertical(board, piece)
        score = score + vScore

        let dScore = AI.scoreDescending(board, piece)
        score = score + dScore

        let aScore = AI.scoreAscending(board, piece)
        score = score + aScore

        //console.log("[", cScore, hScore, vScore, dScore, aScore, "]")

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

}

module.exports = AI