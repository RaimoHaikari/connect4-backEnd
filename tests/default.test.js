const AI = require("../classes/AI");
const Board = require('../classes/Board');
const Settings = require('../classes/Settings');
const Node = require('../classes/Node');

const logger = require('../utils/logger');
const TestCases = require('../classes/TestCases');

const sortInt = (a,b) => {
    return a - b;
}

describe('tasta se lahtee', () => {

    /*
    test('Tietokone löytää yhden päässä olevan voittosiirron', () => {

        const board = new Board(Settings.ROWS, Settings.COLS);

        for(let i = 0; i < TestCases.AI_IS_ONE_MOVE_AWAY_FROM_THE_WIN.length; i++) {

            let x = TestCases.AI_IS_ONE_MOVE_AWAY_FROM_THE_WIN[i];
            board.state = x

            let debugNode = new Node();

            let val = AI.ABMinValue(
                board, 
                2, 
                Settings.AI_MAX_SCORE, 
                Settings.PLAYER_MAX_SCORE, 
                debugNode)
    
            expect(val.column).toBe(x.suppose)
        }

    })
    */

    /*
    describe('funktio: isTerminalNode', () => {

        test('tietokone voitti', () => {

            const board = new Board(Settings.ROWS, Settings.COLS);

            let x = TestCases.GAME_IS_IN_END_STATE[0];
            board.state = x
            let val = AI.isTerminalNode(board);

            expect(val.terminalNode).toBe(true);
            expect(val.winningPiece).toBe(Settings.AI_PIECE);
    
        })

        test('pelaaja voitti', () => {

            const board = new Board(Settings.ROWS, Settings.COLS);

            let x = TestCases.GAME_IS_IN_END_STATE[1];
            board.state = x
            let val = AI.isTerminalNode(board);

            expect(val.terminalNode).toBe(true);
            expect(val.winningPiece).toBe(Settings.PLAYER_PIECE);
    
        })

        test('peli päättyi ratkaisemattomaan', () => {

            const board = new Board(Settings.ROWS, Settings.COLS);

            let x = TestCases.GAME_IS_IN_END_STATE[2];
            board.state = x
            let val = AI.isTerminalNode(board);

            expect(val.terminalNode).toBe(true);
            expect(typeof val.winningPiece).toBe('undefined');
    
        })

        test('kumpikaan ei voittanut ja pöydällä on tilaa', () => {

            const board = new Board(Settings.ROWS, Settings.COLS);

            let x = TestCases.GAME_IS_IN_END_STATE[3];
            board.state = x
            let val = AI.isTerminalNode(board);

            expect(val.terminalNode).toBe(false);
            expect(typeof val.winningPiece).toBe('undefined');
    
        })

    })
    */

    describe('funktio: Board:getOpenCols', () => {

        test('pöydällä ei ole enää tilaa', () => {

            const board = new Board(Settings.ROWS, Settings.COLS);
            let x = TestCases.END_STATES['draw']; 
            board.state = x;
    
            let valA = board.getOpenCols();
            expect(valA).toEqual([])
        })

        test('pöydällä on tilaa', () => {

            const board = new Board(Settings.ROWS, Settings.COLS);
            let x = TestCases.END_STATES['desc_diagonal_slope']; 
            board.state = x;
    
            let valA = board.getOpenCols();
            expect(valA.length).toEqual(Settings.COLS)
        })
    })

    describe('funktio: Board:isWinningMove', () => {

        test('pöydällä on vaakasuora pelaajan voittorivi', () => {

            const board = new Board(Settings.ROWS, Settings.COLS);
            let x = TestCases.END_STATES['horizontal_line']; 
            board.state = x;

            // tietokoneen voittoriviä ei ole
            let valA = board.winningMove(Settings.AI_PIECE)
            expect(valA).toEqual(false)

            // sensijaan pelaajan voittorivi pitää löytyä
            let valB = board.winningMove(Settings.PLAYER_PIECE)
            expect(valB).toEqual(x.winningIndicies)

        })

        test('pöydällä on pystysuora tietokoneen voittorivi', () => {

            const board = new Board(Settings.ROWS, Settings.COLS);
            let x = TestCases.END_STATES['vertical_line']; 
            board.state = x;

            // tietokoneen voittoriviä ei ole
            let valA = board.winningMove(Settings.AI_PIECE)
            expect(valA.sort(sortInt)).toEqual(x.winningIndicies.sort(sortInt))
            
            // sensijaan pelaajan voittorivi pitää löytyä
            let valB = board.winningMove(Settings.PLAYER_PIECE)
            expect(valB).toEqual(false)

        })

        test('pöydällä on tietokoneen voittorivi (nouseva diagonaalisuora)', () => {

            const board = new Board(Settings.ROWS, Settings.COLS);
            let x = TestCases.END_STATES['asc_diagonal_slope']; 
            board.state = x  
    
            // tietokoneen voittorivi pitää löytyä
            let valA = board.winningMove(Settings.AI_PIECE)
            expect(valA).toEqual(x.winningIndicies)

            // sensijaan pelaajan voittoriviä ei ole
            let valB = board.winningMove(Settings.PLAYER_PIECE)
            expect(valB).toEqual(false)

        })

        test('pöydällä on tietokoneen voittorivi (laskeva diagonaalisuora)', () => {

            const board = new Board(Settings.ROWS, Settings.COLS);
            let x = TestCases.END_STATES['desc_diagonal_slope']; 
            board.state = x  
    
            // tietokoneen voittorivi pitää löytyä
            let valA = board.winningMove(Settings.AI_PIECE)
            expect(valA.sort(sortInt)).toEqual(x.winningIndicies.sort(sortInt))

            // sensijaan pelaajan voittoriviä ei ole
            let valB = board.winningMove(Settings.PLAYER_PIECE)
            expect(valB).toEqual(false)

        })

        test('kaikki ruudut ovat käytössä, mutta kumpikaan pelaaja ei voittanut', () => {

            const board = new Board(Settings.ROWS, Settings.COLS);
            let x = TestCases.END_STATES['draw']; 
            board.state = x;

            // pelaajan voittoriviä ei ole
            let valB = board.winningMove(Settings.PLAYER_PIECE)
            expect(valB).toEqual(false)

            // tietokoneen voittoriviä ei ole
            let valA = board.winningMove(Settings.AI_PIECE)
            expect(valA).toEqual(false)

        })



    })


})