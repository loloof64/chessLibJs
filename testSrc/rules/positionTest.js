import {expect, assert} from 'chai';
import {Board} from '../../lib/rules/position';
import {Piece} from '../../lib/rules/pieces';

/**
 * Brute string representation of a board, as opposed to FEN string : each empty cell is represented,
 * empty cells are not grouped.
 * @param {Array[Array[Piece]]} board
 * @return String
 */
function boardArrayToBruteString(board){
    return board.values.map((line) => line.map((cell) => cell ? cell.toFEN() : '_').join('')).reverse().join('/');
}

function boardValuesFromBruteString(valuesStr){
    const valuesToReturn = [];
    const valuesLines = valuesStr.split('/');
    for (let line of valuesLines){
        const lineValues = [];
        for (let cellValue of line){
            lineValues.push(cellValue == '_' ? null : Piece.fromFEN(cellValue));
        }
        valuesToReturn.push(lineValues);
    }
    return valuesToReturn;
}

describe('Board', function(){
    it("is generated correctly from FEN", function(){
        const board1 = Board.fromFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
        assert.equal(boardArrayToBruteString(board1),
            'RNBQKBNR/PPPPPPPP/________/________/________/________/pppppppp/rnbqkbnr');

        const board2 = Board.fromFEN('3r1rk1/5pp1/7p/8/3Q4/3B4/5PPP/5RK1 w - - 0 1');
        assert.equal(boardArrayToBruteString(board2), 
            '_____RK_/_____PPP/___B____/___Q____/________/_______p/_____pp_/___r_rk_'
         );

        const board3 = Board.fromFEN('5r2/5p1p/4N1p1/2n5/8/5kPq/5P1P/5RK1 b - - 0 1');
        assert.equal(boardArrayToBruteString(board3),
            '_____RK_/_____P_P/_____kPq/________/__n_____/____N_p_/_____p_p/_____r__'
         );
    });

    it("generates FEN string correctly", function(){
        const board1 = new Board();
        board1.values = boardValuesFromBruteString('RNBQKBNR/PPPPPPPP/________/________/________/________/pppppppp/rnbqkbnr');
        assert.equal(board1.toFEN(), 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');

        const board2 = new Board();
        board2.values = boardValuesFromBruteString('_____RK_/_____PPP/___B____/___Q____/________/_______p/_____pp_/___r_rk_');
        assert.equal(board2.toFEN(), '3r1rk1/5pp1/7p/8/3Q4/3B4/5PPP/5RK1');

        const board3 = new Board();
        board3.values = boardValuesFromBruteString('_____RK_/_____P_P/_____kPq/________/__n_____/____N_p_/_____p_p/_____r__');
        assert.equal(board3.toFEN(), '5r2/5p1p/4N1p1/2n5/8/5kPq/5P1P/5RK1');
    });
});