//const { response } = require('express')
const Settings = require('./classes/Settings')
const Game = require('./classes/Game')

const express = require('express')
const cors = require('cors') // Cross-origin resource sharing (CORS) 

const app = express()

/*
 * Jotta pääsisimme pyynnön mukana lähetettyyn dataan helposti käsiksi, 
 * tarvitsemme Expressin tarjoaman json-parserin apua.
 */
app.use(express.json())

/*
 * Voimme sallia muista origineista tulevat pyynnöt käyttämällä Noden cors-middlewarea.
 * (same origin policy ja CORS )
 */
app.use(cors())


app.get('/', (req,res) => {
    res.send('<h3>Connect4</h3>')
})

/*
 * 
 */ 
app.get('/api/c4/setup', (req, res) => {
    res.json({
        rows: Settings.ROWS,
        cols: Settings.COLS,
        winningLength: Settings.WINNING_LENGTH,
        firstMove: Settings.PLAYER_TURN,
        moves: []
    })
})

/*
 * Selaimessa tehdyn siirron vastaanotto
 *
 * {
 *   firstMove: 0,
 *   moves: [38]
 * }
 */
app.post('/api/c4/move', (request, response) => {
    const move = request.body

    const game = new Game()
    let val = game.processMove(move)

    response.json(val)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
