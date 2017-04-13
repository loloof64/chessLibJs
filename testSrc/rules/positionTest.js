import {expect, assert} from 'chai';
import {Board} from '../../lib/rules/position';

/**
 * Brute string representation of a board, as opposed to FEN string : each empty cell is represented,
 * empty cells are not grouped.
 * @param {Array[Array[Piece]]} board
 * @return String
 */
function boardArrayToBruteString(board){
    return board.values.map((line) => line.map((cell) => cell ? cell.toFEN() : '_').join('')).join('/');
}

describe('Board', function(){
    it("is generated correctly from FEN", function(){
        const board1 = Board.fromFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
        assert.equal(boardArrayToBruteString(board1),
            'rnbqkbnr/pppppppp/________/________/________/________/PPPPPPPP/RNBQKBNR');

        const board2 = Board.fromFEN('3r1rk1/5pp1/7p/8/3Q4/3B4/5PPP/5RK1 w - - 0 1');
        assert.equal(boardArrayToBruteString(board2), 
            '___r_rk_/_____pp_/_______p/________/___Q____/___B____/_____PPP/_____RK_'
         );

        const board3 = Board.fromFEN('5r2/5p1p/4N1p1/2n5/8/5kPq/5P1P/5RK1 b - - 0 1');
        assert.equal(boardArrayToBruteString(board3),
            '_____r__/_____p_p/____N_p_/__n_____/________/_____kPq/_____P_P/_____RK_'
         );
    });
});