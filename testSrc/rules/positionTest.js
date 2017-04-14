import {expect, assert} from 'chai';
import _ from 'lodash';
import {Board, GameInfo, CastleRights, Position} from '../../lib/rules/position';
import {Piece} from '../../lib/rules/pieces';

/**
 * Brute string representation of a board, as opposed to FEN string : each empty cell is represented,
 * empty cells are not grouped. Furthermore, first rank is coded first : the order is preserved, as opposite to FEN.
 * @param {Array[Array[Piece]]} board
 * @return String
 */
function boardArrayToBruteString(board){
    return board.values.map((line) => line.map((cell) => cell ? cell.toFEN() : '_').join('')).join('/');
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

    it("generates FEN board part correctly", function(){
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

describe('CastleRights', function(){
    it('is generated correctly from FEN', function(){
        const rights1 = CastleRights.fromFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
        assert.isTrue(_.isEqual(rights1, new CastleRights(true, true, true, true)));

        const rights2 = CastleRights.fromFEN('8/8/8/3k4/8/8/3K4/8 w - - 0 30');
        assert.isTrue(_.isEqual(rights2, new CastleRights(false, false, false, false)));

        const rights3 = CastleRights.fromFEN('r1bq1rk1/pppp1ppp/2n2n2/2b1p3/2B1P3/P1N2N2/1PPP1PPP/R1BQK2R w KQ - 0 10');
        assert.isTrue(_.isEqual(rights3, new CastleRights(true, true, false, false)));

        const rights4 = CastleRights.fromFEN('rnbqkbnr/ppp2ppp/3p4/4p3/7R/P4N2/1PPPPPP1/RNBQKB2 b Qkq - 0 8');
        assert.isTrue(_.isEqual(rights4, new CastleRights(false, true, true, true)));
    });

    it('generate FEN castle part correctly', function(){
        const rights1 = new CastleRights(true, true, true, true);
        assert.equal('KQkq', rights1.toFEN());

        const rights2 = new CastleRights(false, false, false, false);
        assert.equal('-', rights2.toFEN());

        const rights3 = new CastleRights(true, true, false, false);
        assert.equal('KQ', rights3.toFEN());

        const rights4 = new CastleRights(false, true, true, true);
        assert.equal('Qkq', rights4.toFEN());
    });
});

describe('GameInfo', function(){
    it('is generated correctly from FEN', function(){
        const info1 = GameInfo.fromFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
        assert.isTrue(_.isEqual(info1, new GameInfo(true, new CastleRights(true, true, true, true), null, 0, 1)));

        const info2 = GameInfo.fromFEN('k2rr3/2pn2pp/p4p2/8/8/6P1/2P2P1P/RR4K1 b - - 13 20');
        assert.isTrue(_.isEqual(info2, new GameInfo(false, new CastleRights(false, false, false, false), null, 13, 20)));

        const info3 = GameInfo.fromFEN('r1bqkbnr/ppp1pppp/2n5/3pP3/8/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 3');
        assert.isTrue(_.isEqual(info3, new GameInfo(true, new CastleRights(true, true, true, true), Board.FILE_D, 0, 3)));

        const info4 = GameInfo.fromFEN('rnbqkbnr/ppp1pppp/8/8/3pP3/5N1P/PPPP1PP1/RNBQKB1R b KQkq e3 0 3');
        assert.isTrue(_.isEqual(info4, new GameInfo(false, new CastleRights(true, true, true, true), Board.FILE_E, 0, 3)));
    });

    it('generate FEN info part correctly', function(){
        const info1 = new GameInfo(true, new CastleRights(true, true, true, true), null, 0, 1);
        assert.equal('w KQkq - 0 1', info1.toFEN());

        const info2 = new GameInfo(false, new CastleRights(false, false, false, false), null, 13, 20);
        assert.equal('b - - 13 20', info2.toFEN());

        const info3 = new GameInfo(true, new CastleRights(true, true, true, true), Board.FILE_D, 0, 3);
        assert.equal('w KQkq d6 0 3', info3.toFEN());

        const info4 = new GameInfo(false, new CastleRights(true, true, true, true), Board.FILE_E, 0, 3);
        assert.equal('b KQkq e3 0 3', info4.toFEN());
    });
});

describe('Position', function(){
    it('is generated correctly from FEN', function (){
        const pos1 = Position.fromFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
        const board1 = new Board();
        board1.values = boardValuesFromBruteString('RNBQKBNR/PPPPPPPP/________/________/________/________/pppppppp/rnbqkbnr');
        const gameInfo1 = new GameInfo(true, new CastleRights(true, true, true, true), null, 0, 1);
        assert.isTrue(_.isEqual(pos1, new Position(board1, gameInfo1)));

        const pos2 = Position.fromFEN('k2rr3/2pn2pp/p4p2/8/8/6P1/2P2P1P/RR4K1 b - - 13 20');
        const board2 = new Board();
        board2.values = boardValuesFromBruteString('RR____K_/__P__P_P/______P_/________/________/p____p__/__pn__pp/k__rr___');
        const gameInfo2 = new GameInfo(false, new CastleRights(false, false, false, false), null, 13, 20);
        assert.isTrue(_.isEqual(pos2, new Position(board2, gameInfo2)));

        const pos3 = Position.fromFEN('r1bqkbnr/ppp1pppp/2n5/3pP3/8/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 3');
        const board3 = new Board();
        board3.values = boardValuesFromBruteString('RNBQKBNR/PPPP_PPP/________/________/___pP___/__n_____/ppp_pppp/r_bqkbnr');
        const gameInfo3 = new GameInfo(true, new CastleRights(true, true, true, true), Board.FILE_D, 0, 3);
        assert.isTrue(_.isEqual(pos3, new Position(board3, gameInfo3)));

        const pos4 = Position.fromFEN('rnbqkbnr/ppp1pppp/8/8/3pP3/5N1P/PPPP1PP1/RNBQKB1R b KQkq e3 0 3');
        const board4 = new Board();
        board4.values = boardValuesFromBruteString('RNBQKB_R/PPPP_PP_/_____N_P/___pP___/________/________/ppp_pppp/rnbqkbnr');
        const gameInfo4 = new GameInfo(false, new CastleRights(true, true, true, true), Board.FILE_E, 0, 3);
        assert.isTrue(_.isEqual(pos4, new Position(board4, gameInfo4)));
    });

    it('generate FEN correctly', function(){
        const board1 =  new Board();
        board1.values = boardValuesFromBruteString('RNBQKBNR/PPPPPPPP/________/________/________/________/pppppppp/rnbqkbnr');
        const gameInfo1 = new GameInfo(true, new CastleRights(true, true, true, true), null, 0, 1);
        const position1 = new Position(board1, gameInfo1);
        assert.equal('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', position1.toFEN());

        const board2 = new Board();
        board2.values = boardValuesFromBruteString('RR____K_/__P__P_P/______P_/________/________/p____p__/__pn__pp/k__rr___');
        const gameInfo2 = new GameInfo(false, new CastleRights(false, false, false, false), null, 13, 20);
        const position2 = new Position(board2, gameInfo2);
        assert.equal('k2rr3/2pn2pp/p4p2/8/8/6P1/2P2P1P/RR4K1 b - - 13 20', position2.toFEN());

        const board3 = new Board();
        board3.values = boardValuesFromBruteString('RNBQKBNR/PPPP_PPP/________/________/___pP___/__n_____/ppp_pppp/r_bqkbnr');
        const gameInfo3 = new GameInfo(true, new CastleRights(true, true, true, true), Board.FILE_D, 0, 3);
        const position3 = new Position(board3, gameInfo3);
        assert.equal('r1bqkbnr/ppp1pppp/2n5/3pP3/8/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 3', position3.toFEN());

        const board4 = new Board();
        board4.values = boardValuesFromBruteString('RNBQKB_R/PPPP_PP_/_____N_P/___pP___/________/________/ppp_pppp/rnbqkbnr');
        const gameInfo4 = new GameInfo(false, new CastleRights(true, true, true, true), Board.FILE_E, 0, 3);
        const position4 = new Position(board4, gameInfo4);
        assert.equal('rnbqkbnr/ppp1pppp/8/8/3pP3/5N1P/PPPP1PP1/RNBQKB1R b KQkq e3 0 3', position4.toFEN());
    });
});