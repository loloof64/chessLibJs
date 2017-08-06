import { expect, assert } from 'chai';
import _ from 'lodash';
import { Piece, Pawn, Knight, Bishop, Rook, Queen, King } from '../../lib/rules/pieces';
import { Board, Position, Cell, IllegalMoveError } from '../../lib/rules/position';
import { InstantiationError, UnknownPieceFENError } from '../../lib/errors/errors';

describe('Piece', function () {
    it('cannot be instantiated', function () {
        expect(function () { new Piece(true) }).to.throw(InstantiationError);
        expect(function () { new Piece(false) }).to.throw(InstantiationError);
    });
    it('generate correct piece when Piece.fromFEN() is called', function () {
        expect(function () { Piece.fromFEN('Z') }).to.throw(UnknownPieceFENError);

        assert.isTrue(_.isEqual(new Pawn(true), Piece.fromFEN('P')));
        assert.isTrue(_.isEqual(new Pawn(false), Piece.fromFEN('p')));

        assert.isTrue(_.isEqual(new Knight(true), Piece.fromFEN('N')));
        assert.isTrue(_.isEqual(new Knight(false), Piece.fromFEN('n')));

        assert.isTrue(_.isEqual(new Bishop(true), Piece.fromFEN('B')));
        assert.isTrue(_.isEqual(new Bishop(false), Piece.fromFEN('b')));

        assert.isTrue(_.isEqual(new Rook(true), Piece.fromFEN('R')));
        assert.isTrue(_.isEqual(new Rook(false), Piece.fromFEN('r')));

        assert.isTrue(_.isEqual(new Queen(true), Piece.fromFEN('Q')));
        assert.isTrue(_.isEqual(new Queen(false), Piece.fromFEN('q')));

        assert.isTrue(_.isEqual(new King(true), Piece.fromFEN('K')));
        assert.isTrue(_.isEqual(new King(false), Piece.fromFEN('k')));
    });
})

describe('Pawn', function () {
    it('should produce valid FEN string', function () {
        assert.equal('P', new Pawn(true).toFEN());
        assert.equal('p', new Pawn(false).toFEN());
    });
});

describe('Knight', function () {
    it('should produce valid FEN string', function () {
        assert.equal('N', new Knight(true).toFEN());
        assert.equal('n', new Knight(false).toFEN());
    });
    it('moves and captures jumping over pieces and in a oblique line', function () {
        const position1 = Position.fromFEN('4k3/8/8/2b5/2N5/3P4/8/4K3 w - - 0 1');
        assert.doesNotThrow(() => position1.move(
            new Cell(Board.FILE_C, Board.RANK_4),
            new Cell(Board.FILE_B, Board.RANK_6)
        ), IllegalMoveError);
        assert.doesNotThrow(() => position1.move(
            new Cell(Board.FILE_C, Board.RANK_4),
            new Cell(Board.FILE_D, Board.RANK_2)
        ), IllegalMoveError);
        assert.doesNotThrow(() => position1.move(
            new Cell(Board.FILE_C, Board.RANK_4),
            new Cell(Board.FILE_A, Board.RANK_5)
        ), IllegalMoveError);
        assert.throws(() => position1.move(
            new Cell(Board.FILE_C, Board.RANK_4),
            new Cell(Board.FILE_A, Board.RANK_4)
        ), IllegalMoveError);
        assert.throws(() => position1.move(
            new Cell(Board.FILE_C, Board.RANK_4),
            new Cell(Board.FILE_B, Board.RANK_7)
        ), IllegalMoveError);
        assert.throws(() => position1.move(
            new Cell(Board.FILE_C, Board.RANK_4),
            new Cell(Board.FILE_E, Board.RANK_6)
        ), IllegalMoveError);

        const position2 = Position.fromFEN('4k3/8/8/2b5/2n5/3P4/8/4K3 b - - 0 1');
        assert.doesNotThrow(() => position2.move(
            new Cell(Board.FILE_C, Board.RANK_4),
            new Cell(Board.FILE_E, Board.RANK_3)
        ), IllegalMoveError);
        assert.doesNotThrow(() => position2.move(
            new Cell(Board.FILE_C, Board.RANK_4),
            new Cell(Board.FILE_B, Board.RANK_2)
        ), IllegalMoveError);
        assert.doesNotThrow(() => position2.move(
            new Cell(Board.FILE_C, Board.RANK_4),
            new Cell(Board.FILE_D, Board.RANK_6)
        ), IllegalMoveError);
        assert.throws(() => position2.move(
            new Cell(Board.FILE_C, Board.RANK_4),
            new Cell(Board.FILE_G, Board.RANK_3)
        ), IllegalMoveError);
        assert.throws(() => position2.move(
            new Cell(Board.FILE_C, Board.RANK_4),
            new Cell(Board.FILE_C, Board.RANK_7)
        ), IllegalMoveError);
        assert.throws(() => position2.move(
            new Cell(Board.FILE_C, Board.RANK_4),
            new Cell(Board.FILE_H, Board.RANK_4)
        ), IllegalMoveError);
    })
});

describe('Bishop', function () {
    it('should produce valid FEN string', function () {
        assert.equal('B', new Bishop(true).toFEN());
        assert.equal('b', new Bishop(false).toFEN());
    });
});

describe('Rook', function () {
    it('should produce valid FEN string', function () {
        assert.equal('R', new Rook(true).toFEN());
        assert.equal('r', new Rook(false).toFEN());
    });
});

describe('Queen', function () {
    it('should produce valid FEN string', function () {
        assert.equal('Q', new Queen(true).toFEN());
        assert.equal('q', new Queen(false).toFEN());
    });
});

describe('King', function () {
    it('should produce valid FEN string', function () {
        assert.equal('K', new King(true).toFEN());
        assert.equal('k', new King(false).toFEN());
    });
});