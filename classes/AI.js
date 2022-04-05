const Settings = require('./Settings')
const Node = require('./Node')

const deSmet = require('./score_functions/deSmet');
// const deSmet = require('./classes/score_functions/deSmet');

class AI {

    static evaluationFunction = deSmet.scorePosition

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

            

            let s = AI.evaluationFunction(
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

        /*
         * - vaihe 1: saavutettiinko lopputila?
         *   Pelilauta on tilassa, jossa tietokone on juuri asettanut pelimerkin.
         */
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

            let score = AI.evaluationFunction(board, piece)

            //console.log(`c: ${col}: ${score}`)

            if(score > bestScore){
                bestScore = score
                bestCol = col
            }

            board.removeThePiece(row, col)

        }

        return bestCol
    }
    



}

module.exports = AI