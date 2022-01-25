const Settings = require('./Settings')

class Board {

    #rows;
    #cols;
    #board;

    debug(){

        console.log("............. setting board ..................")
        
        //this.#board[5][0] = Settings.AI_PIECE
        //this.#board[5][1] = Settings.AI_PIECE
        //this.#board[4][2] = Settings.AI_PIECE
        //this.#board[5][5] = Settings.AI_PIECE
        //this.#board[5][4] = Settings.AI_PIECE 
        //this.#board[4][3] = Settings.AI_PIECE 

        //this.#board[5][2] = Settings.PLAYER_PIECE
        //this.#board[5][3] = Settings.PLAYER_PIECE
        //this.#board[4][3] = Settings.PLAYER_PIECE
        //this.#board[5][2] = Settings.PLAYER_PIECE
        //this.#board[4][2] = Settings.PLAYER_PIECE
        //this.#board[5][6] = Settings.PLAYER_PIECE
        //this.#board[4][5] = Settings.PLAYER_PIECE
        //this.#board[4][6] = Settings.PLAYER_PIECE
        //this.#board[5][0] = Settings.PLAYER_PIECE

    }


    constructor(rows, cols) {
        this.#rows = rows;
        this.#cols = cols;

        this.#board = Array(rows)
            .fill(0)
            .map(x => Array(cols).fill(Settings.FREE))

        this.debug()
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

                //console.log(x, nRow, nCol)

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

                //console.log(x, nRow, nCol)

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
     * Muunnetaan solua vastaava indeksi rivi ja sarake muotoon
     */
    indexToRC(ind){

        return {
            r: Math.floor(ind/this.#cols),
            c: ind%this.#cols
        }

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
        //console.log(this.#rows-1)
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

        console.log(str)

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

    winningMove(piece) {

        //console.log(".... in winningMove ...")

        let window = Array(Settings.WINNING_LENGTH)

        // Check horizontal locations for win
        for(let r = 0; r < this.#rows; r++) {
            for(let c = 0; c <= this.#cols - Settings.WINNING_LENGTH; c++){

                let success = true

                for(let x = 0; x < Settings.WINNING_LENGTH; x++){
                    //window[x] = this.#board[r][c+x]
                    window[x] = this.rcToIndex(r+x,c)

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

                    //window[x] = this.#board[r+x][c+x]

                    if(this.#board[r+x][c+x] !== piece)
                        success = false
                    
                }

                if(success)
                    return true

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

                //console.log(window)

                if(success)
                    return window

            }
        }
        


        return false
    }

}

module.exports = Board