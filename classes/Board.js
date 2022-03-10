const Settings = require('./Settings');

const logger = require('../utils/logger');


/*
 * Pelilaudan tilanteen, ts. asetetut nappulat, tallettava luokka.
 *
 * Yksittäisen peliruudun sijainti voidaan määrittää:
 * - sijaintipaikan rivi- ja sarakenumeroiden avulla
 * - ruudun järjestysnumerona kaikkien ruutujen joukossa
 *
 * Luokka ei ota kantaa siihen kumpi pelaaja on vuorossa, vaan lautaa täytetään
 * vastaanotettujen pyyntöjen mukaisesti.
 *
 * @todo: Löytyy sekä isWinningMove että winningMove. 
 * - toiselle välitetään parametrinä viimeksi tehty siirto ja voittoriviä etsitään
 *   tähän kohtaan osuvista linjoista
 * - toinen tutkii koko pöydän.
 * - Voiko nämä esim. yhdistää?
 */
class Board {

    #rows;
    #cols;
    #board;

    constructor(rows, cols) {
        this.#rows = rows;
        this.#cols = cols;

        this.reset();   // Alustetaan halutun kokoinen tyhjä pöytä
    }

    /*
     * Keskimmäisen sarakkeen indeksinumero
     */
    get center() {
        return Math.floor(this.#cols/2)
    }

    /*
     * Pelipöydän sarakkeiden määrä
     */
    get cols() {
        return this.#cols
    }

    /*
     * Pelipöydän rivien määrä
     */
    get rows() {
        return this.#rows
    }

    /*
     * Asetetaan pelipöytä haluttuun tilaan
     */
    set state(pos) {

        logger.info("............. setting board ..................");

        this.reset();

        let turn = pos.firstMove === Settings.PLAYER_TURN ? Settings.PLAYER_TURN : Settings.AI_TURN
        let piece = turn === Settings.PLAYER_TURN ? Settings.PLAYER_PIECE : Settings.AI_PIECE
        let moves = pos.moves;

        for(let x = 0; x < moves.length; x++){

            let ind = moves[x]
            let rc = this.indexToRC(ind)
        
            this.#board[rc.r][rc.c] = piece

            piece = -1 * piece
        }

    }


    /*
     * Tarkistetaan kulkeeko parametrien @row ja @col määrittämän solun kautta nousevan diagonaalin
     * suuntainen voittolinja.
     * 
     * Mikäli voittolinja löytyy, palautetaan linjan muodostavien solujen indeksit 
     * Mikäli ei, palautetaan false
     */
    checkAscending(row, col, piece) {

        for(let x = -(Settings.WINNING_LENGTH-1); x <=0;  x++) {

            let arr = []
            let windowOk = true

            for(let deltaC = 0; deltaC < Settings.WINNING_LENGTH; deltaC++){

                
                let nCol = col+(1*x)+deltaC
                let nRow = row+(-1*x)-deltaC

                //logger.info(x, nRow, nCol)

                if(nCol<0 || nCol >= this.#cols || nRow <0 || nRow >= this.#rows)
                    windowOk = false

                //arr.push(this.rcToIndex(nRow, nCol))
                arr.push({r: nRow, c: nCol})
            }


            if(!windowOk)
                continue

            if(this.checkWindow(arr, piece)){
                return arr.map(a => this.rcToIndex(a.r, a.c))
            }

        }

        return false        
    }

    /*
     * Tarkistetaan kulkeeko parametrien @row ja @col määrittämän solun kautta laskevan diagonaalin
     * suuntainen voittolinja.
     * 
     * Mikäli voittolinja löytyy, palautetaan linjan muodostavien solujen indeksit 
     * Mikäli ei, palautetaan false
     */
    checkDescending(row, col, piece) {

        for(let x = -(Settings.WINNING_LENGTH-1); x <=0;  x++) {

            let arr = []
            let windowOk = true

            for(let deltaC = 0; deltaC < Settings.WINNING_LENGTH; deltaC++){

                
                let nCol = col+(-1*x)-deltaC
                let nRow = row+(-1*x)-deltaC

                //logger.info(x, nRow, nCol)

                if(nCol<0 || nCol >= this.#cols || nRow <0 || nRow >= this.#rows)
                    windowOk = false

                //arr.push(this.rcToIndex(nRow, nCol))
                arr.push({r: nRow, c: nCol})

            }

            if(!windowOk)
                continue            

            if(this.checkWindow(arr, piece)){
                return arr.map(a => this.rcToIndex(a.r, a.c))
            }


        }

        return false        
    }


    /*
     * Tarkistetaan kulkeeko parametrien @row ja @col määrittämän solun kautta vaakasuora voittolinja
     * Mikäli voittolinja löytyy, palautetaan linjan muodostavien solujen indeksit 
     * Mikäli ei, palautetaan false
     */ 
    checkHorizontal(row, col, piece){

        for(let x = 0; x > -Settings.WINNING_LENGTH; x--) {

            let arr = []
            let windowOk = true

            for(let deltaC = 0; deltaC < Settings.WINNING_LENGTH; deltaC++){
                let indx = col+x+deltaC

                if(indx<0 || indx >= this.#cols)
                    windowOk = false

                //arr.push(this.rcToIndex(row, indx))
                arr.push({r: row, c: indx})

            }

            if(!windowOk)
                continue

            if(this.checkWindow(arr, piece)){
                return arr.map(a => this.rcToIndex(a.r, a.c))
            }

        }

        return false

    }

    
    /*
     * Tarkistetaan kulkeeko parametrien @row ja @col määrittämän solun kautta pystysuora voittolinja
     * Mikäli voittolinja löytyy, palautetaan linjan muodostavien solujen indeksit 
     * Mikäli ei, palautetaan false
     */ 
    checkVertical(r, c, piece) {

        for(let y = 0; y > -Settings.WINNING_LENGTH; y--) {

            let arr = []
            let windowOk = true

            for(let deltaR = 0; deltaR < Settings.WINNING_LENGTH; deltaR++){
                let indx = r+y+deltaR

                if(indx<0 || indx >= this.#rows)
                    windowOk = false

                //arr.push(this.rcToIndex(indx, c))
                arr.push({r: indx, c: c})

            }

            if(!windowOk)
                continue

            if(this.checkWindow(arr, piece)){
                return arr.map(a => this.rcToIndex(a.r, a.c))
            }
    

        }

        return false
    }
    
    /*
     * Parametrillä w välitetään taulukko, joka sisältää pelipöydän osoitteita.
     *
     * Mikäli kaikissa osoitteita vastaavissa soluissa on parametria piece vastaava
     * pelimerkki, niin palautetaan true. 
     * Jos jostain solusta löytyy jotain muuta, palautetaan false.
     */
    checkWindow(w, piece){

        for(let i = 0; i < w.length; i++) {

            let {r,c} = w[i]
            let mark = this.#board[r][c]

            if(mark !== piece)
                return false

        }

        return true
    }

    /*
     * Sijoitetaan pelimerkki määrättyyn ruutuun
     * - funktion removeThePiece poistaa pelimerkin 
     */
    dropThePiece(row, col, piece){
        this.#board[row][col] = piece
    }

    /*
     * Etsitään sarakkeen ensimmäinen vapaa rivi
     * - sarakkeita täytetään alhaalta alkaen, ts. ensimmäinen rivi 
     *   on sama kuin taulukon rivimäärä - 1
     *   
     */
    getNextOpenRow(col) {

        let r = this.#rows - 1;

        for(; r >= 0; r--){
            let mark = this.#board[r][col]
            
            if(mark === Settings.FREE)
                break            
        }

        return r

    }

    /*
     * Palauttaa parametrien määrittämässä ruudussa olevan pelimerkin
     */
    getMark(row, col) {
        return this.#board[row][col]
    }

    /*
     * Laaditaan luettelo vapaista sarakkeista. Sarake on käytettävissä, mikäli päällimäinen rivi on tyhjä.
     * - Sarakkeet luetellaan lähtien liikkeelle pelilaudan vasemmasta reunasta
     * - päällimmäisen rivin indeksinumero on 0
     */
    getOpenCols(){

        let cols = []

        for(let i = 0; i < this.#cols; i++){
            if(this.isValidLocation(i)) 
                cols.push(i)
        }

        return cols
    }

    
    /*
     * Laaditaan luettelo vapaista sarakkeista. Sarake on käytettävissä, mikäli päällimäinen rivi on tyhjä.
     * - Sarakkeet luetellaan lähtien liikkelle pelilaudan keskustasta
     * - päällimmäisen rivin indeksinumero on 0
     */
    getOpenColsCenter() {

        let cols = []
        
        let base = this.center
        let laskuri = 0
        let alaOk = true
        let ylaOk = true

        while(true){
        
            let coef = (laskuri % 2 === 0) ? 1: -1;
            let move = laskuri * coef;
        
            base = base + move;
        
            if(base < 0)
                alaOk = false
            else if (base >= this.#cols)
                ylaOk = false
            else{

                if(this.isValidLocation(base)) 
                    cols.push(base)
            }
        
            
            if(alaOk === false && ylaOk === false)
                break
        
            laskuri++
        }

        return cols
    }

    /*
     * Muunnetaan solua vastaava indeksi rivi ja sarake muotoon
     */
    indexToRC(ind){

        return {
            r: Math.floor(ind/this.#cols),
            c: ind%this.#cols
        }

    }

    /*
     * Käydään läpi uusinta siirtoa vastaavan ruudun kautta kulkevat linjat
     * ja tutkitaan sisältääkö jokin näistä voittoon oikeuttavan määrän 
     * pelaajan merkkejä.
     */
    isWinningMove(pos, piece){

        let window;

        // - löytyykö vaakasuoraan olevaa voittoriviä
        window = this.checkHorizontal(pos.r, pos.c, piece)
        if(window)
            return window
        

        // - löytyykö nousevan diagonaalin suuntaista voittoriviä
        window = this.checkAscending(pos.r, pos.c, piece)
        if(window)
            return window

        // - löytyykö laskevan diagonaalin suuntaista voittoriviä
        window = this.checkDescending(pos.r, pos.c, piece)
        if(window)
            return window

        // - löytyykö pystysuoraa voittoriviä
        window = this.checkVertical(pos.r, pos.c, piece)
        if(window)
            return window

        return false
    }


    /*
     * Tarkistetaan onko sarake käytettävissä.
     * - sarake on käytettävissä, mikäli päällimmäisen rivin solu on tyhjä
     *   (ts. osoite: this.#board[0][col])
     */
    isValidLocation(col){
        //logger.info(this.#rows-1)
        return this.#board[0][col] === Settings.FREE
    }

    printBoard() {

        let str = ""

        for(let i = 0; i < this.#rows; i++){
            
            let rowStr = "";

            for(let j = 0; j < this.#cols; j++){

                let mark = this.#board[i][j]
                let strMark = (mark === Settings.AI_PIECE?Settings.AI_PIECE:` ${mark}`)

                rowStr = rowStr + `${strMark} `
            }

            str = str +  rowStr + "\n"
        }

        logger.info(str)

    }

    /*
     * Voisi olla staattinen, jos rivien ja sarakkeiden määrät olisi vakioita,
     * mutta kun eivät ole, niin "tapauskohtainen" muuttuja
     */ 
    rcToIndex(r,c){
        return r*this.#cols + c
    }

    /*
     * Poistetaan ruudussa oleva pelimerrki
     */
    removeThePiece(row, col){
        this.#board[row][col] = Settings.FREE
    }

    /*
     * Asetetaan pöytä tilaan, jossa kaikki ruudut ovat tyhjiä.
     */
    reset(){

        this.#board = Array(this.#rows)
            .fill(0)
            .map(x => Array(this.#cols).fill(Settings.FREE));

    }

    /*
     * Käydään läpi KAIKKI MAHDOLLISET VAIHTOEHDOT, jotka voisivat muodostaa voittosuoran.
     * Eli tutkitaan alueelta löytyvät vaaka-, pysty- ja diagonaaliakselien suuntaiset 
     * neljän peräkkäisen ruudun yhdistelmät.
     */
    winningMove(piece) {

        let window = Array(Settings.WINNING_LENGTH);

        // Check horizontal locations for win
        for(let r = 0; r < this.#rows; r++) {

            for(let c = 0; c <= this.#cols - Settings.WINNING_LENGTH; c++){

                let success = true

                for(let x = 0; x < Settings.WINNING_LENGTH; x++){
                    //window[x] = this.#board[r][c+x]
                    window[x] = this.rcToIndex(r,c+x)

                    if(this.#board[r][c+x] !== piece)
                        success = false
                }

                if(success)
                    return window
        
            }
        }
        

        // Check vertical locations for win
        for(let r = 0; r <= this.#rows - Settings.WINNING_LENGTH; r++){
            for(let c = 0; c < this.#cols; c++) {

                let success = true

                for(let x = 0; x < Settings.WINNING_LENGTH; x++){
                    //window[x] = this.#board[r+x][c]
                    window[x] = this.rcToIndex(r+x,c)

                    if(this.#board[r+x][c] !== piece)
                        success = false
                }

                if(success)
                    return window

            }
        }

        
        // Check negative diagonal
        for(let r = 0; r <= this.#rows - Settings.WINNING_LENGTH; r++){
            for(let c = 0; c <= this.#cols - Settings.WINNING_LENGTH; c++){

                let success = true

                for(let x = 0; x < Settings.WINNING_LENGTH; x++){

                    window[x] = this.rcToIndex(r+x,c+x)
                    //window[x] = this.#board[r+x][c+x]

                    if(this.#board[r+x][c+x] !== piece)
                        success = false
                    
                }

                if(success)
                    return window

            }
        }
        
        

        // Check positive diagonal
        for(let r = 0; r <= this.#rows - Settings.WINNING_LENGTH; r++){
            for(let c = Settings.WINNING_LENGTH - 1; c < this.#cols; c++){

                let success = true

                for(let x = 0; x < Settings.WINNING_LENGTH; x++){

                    //window[x] = this.#board[r+x][c-x]
                    window[x] = this.rcToIndex(r+x,c)

                    if(this.#board[r+x][c-x] !== piece)
                        success = false
                    
                }

                //logger.info(window)

                if(success)
                    return window

            }
        }

        return false
    }

}

module.exports = Board