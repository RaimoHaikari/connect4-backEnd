const Settings = require('./Settings')

/*
 * Peli on tilanteessa, jossa AI kykenee seuraavalla siirrolla voittamaan.
 *
 * Aloittava pelaaja vaihtelee, mutta jokaisessa odotetaan seuraavaksi 
 * tietokoneen siirtoa.
 */
const AI_IS_ONE_MOVE_AWAY_FROM_THE_WIN = [
    {
        description: 'Sarake 6 tuo nousevan diagonaalisen voittorivin',
        firstMove: Settings.AI_TURN,
        moves: [38,39,32,40,33,41,26,34,35,27],
        suppose: 6
    },
    {
        description: 'Sarake 1 tuo vaakasuoran voittorivin',
        firstMove: Settings.PLAYER_TURN,
        moves: [37,30,38,31,39,32,23,36,16],
        suppose: 1   
    },
    {
        description: 'Sarake 0 tuo laskevan diagonaalisen voittorivin',
        firstMove: Settings.AI_TURN,
        moves: [38,37,30,36,29,35,22,28,41,21],
        suppose: 0
    },  
    {
        description: 'Sarake 5 tuo pystysuoran voittorivin',
        firstMove: Settings.PLAYER_TURN,
        moves: [40,33,39,26,32,19,38],
        suppose: 5
    },   
]

const GAME_IS_IN_END_STATE = [
    {
        description: 'Tietokone voitti (nouseva diagonaalinen suora)',
        firstMove: Settings.AI_TURN,
        moves: [38,39,32,40,33,41,26,34,35,27,20],
        isTerminalState: true,
        winningPiece: Settings.AI_PIECE,
        winningIndicies: [20,27,34,41]
    },
    {
        description: 'Pelaaja voitti (laskeva diagonaalinen suora)',
        firstMove: Settings.PLAYER_TURN,
        moves: [38,37,30,36,35,29,22,28,21,41,14],
        isTerminalState: true,
        winningPiece: Settings.PLAYER_PIECE
    },
    {
        description: 'Peli päättyi ratkaisemattomaan',
        firstMove: Settings.PLAYER_TURN,
        moves: [
            35,28,21,14,7,0,
            36,29,22,15,8,1,
            37,30,23,16,9,2,
            39,32,25,18,11,4,
            40,
            38,31,24,17,10,3,
            33,26,19,12,5,
            41,34,27,20,13,6
        ],
        isTerminalState: true,
        winningPiece: undefined
    },
    {
        description: 'Kumpikaan ei ole voittanut ja pelipöydällä on tilaanpm ',
        firstMove: Settings.AI,
        moves: [],
        isTerminalState: false,
        winningPiece: undefined
    },
]

const END_STATES = [];

END_STATES['asc_diagonal_slope'] = {
    description: 'Tietokone voitti (nouseva diagonaalinen suora)',
    firstMove: Settings.AI_TURN,
    moves: [38,39,32,40,33,41,26,34,35,27,20],
    isTerminalState: true,
    winningPiece: Settings.AI_PIECE,
    winningIndicies: [20,27,34,41]
};

END_STATES['horizontal_line'] = {
    description: 'Pelaaja voitti (vaakasuora voittosuora)',
    firstMove: Settings.PLAYER_TURN,
    moves: [37,30,38,31,39,32,23,36,16,35,40],
    isTerminalState: true,
    winningPiece: Settings.PLAYER_PIECE,
    winningIndicies: [37,38,39,40]
}

END_STATES['vertical_line'] = {
    description: 'Tietokone voitti (pystysuora voittorivi)',
    firstMove: Settings.PLAYER_TURN,
    moves: [40,33,39,26,32,19,38,12],
    isTerminalState: true,
    winningPiece: Settings.AI_PIECE,
    winningIndicies: [33,26,19,12]
}

END_STATES['desc_diagonal_slope'] = {
    description: 'Tietokone voitti (laskeva diagonaalinen suora',
    firstMove: Settings.AI_TURN,
    moves: [38,37,30,36,29,35,22,28,41,21,14],
    isTerminalState: true,
    winningPiece: Settings.AI_PIECE,
    winningIndicies: [14,22,30,38]
}

END_STATES['draw'] = {
    description: 'Peli päättyi ratkaisemattomaan',
    firstMove: Settings.PLAYER_TURN,
    moves: [
        35,28,21,14,7,0,
        36,29,22,15,8,1,
        37,30,23,16,9,2,
        39,32,25,18,11,4,
        40,
        38,31,24,17,10,3,
        33,26,19,12,5,
        41,34,27,20,13,6
    ],
    isTerminalState: false,
    winningPiece: undefined,
    winningIndicies: undefined
}

const SCORING = [];

SCORING['a'] = {
    description: 'Tyhjä pöytä',
    firstMove: Settings.AI_TURN,
    lastPiece: Settings.PLAYER_PIECE,
    moves: [],
    playerTot: 69,
    aiTot: 69,
    score: 0
};

SCORING['b'] = {
    description: 'Laudalla on nappuloita, kumpikaan ei ole voittamassa',
    firstMove: Settings.AI_TURN,
    lastPiece: Settings.PLAYER_PIECE,
    moves: [38,31,24,37,30,36],
    playerTot: 45,
    aiTot: 53,
    score: -8
};

/*
 * description: 'Tietokone voitti (laskeva diagonaalinen suora'
 */
SCORING['c'] = {
    ...END_STATES['desc_diagonal_slope'],
    lastPiece: Settings.AI_PIECE,
    playerTot: 0,
    aiTot:0,
    score:0
};

/*
 * description: 'Tietokone voitti (nouseva diagonaalinen suora)'
 */
SCORING['d'] = {
    ...END_STATES['asc_diagonal_slope'],
    lastPiece: Settings.AI_PIECE,
    playerTot: 0,
    aiTot:0,
    score:0
};

/*
 * description: 'Pelaaja voitti (vaakasuora voittosuora)'
 */
SCORING['e'] = {
    ...END_STATES['horizontal_line'],
    lastPiece: Settings.PLAYER_PIECE,
    playerTot: 0,
    aiTot:0,
    score:0
};

/*
 * description: 'Tietokone voitti (pystysuora voittorivi)'
 */
SCORING['f'] = {
    ...END_STATES['vertical_line'],
    lastPiece: Settings.AI_PIECE,
    playerTot: 0,
    aiTot:Settings.AI_MAX_SCORE,
    score:0
};

module.exports = {
    AI_IS_ONE_MOVE_AWAY_FROM_THE_WIN,
    GAME_IS_IN_END_STATE,
    END_STATES,
    SCORING
}

