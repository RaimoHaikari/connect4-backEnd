const Board = require('../classes/Board');
const Settings = require('../classes/Settings');

const deSmet = require('../classes/score_functions/deSmet');

const TestCases = require('../classes/TestCases');

/*
*/
describe('deSmet evaluation function', () => {


        test('tyhjä pelilauta', () => {

            const board = new Board(Settings.ROWS, Settings.COLS);
            let x = TestCases.SCORING['a']; 
            board.state = x;
    
            let valA = deSmet.scorePosition(board, x.lastPiece);
            expect(valA).toEqual(x.score)
        })

        test('laudalla on nappuloita, kumpikaan ei ole voittamassa', () => {

            const board = new Board(Settings.ROWS, Settings.COLS);
            let x = TestCases.SCORING['b']; 
            board.state = x;
    
            let valA = deSmet.scorePosition(board, x.lastPiece);
            expect(valA).toEqual(x.score)
        })

});