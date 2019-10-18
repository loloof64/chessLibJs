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

    it('can move in diagonal as far as the path is free', function () {
        const position1 = Position.fromFEN('4k3/8/8/8/3B4/8/8/4K3 w - - 0 1');
        assert.doesNotThrow(() => position1.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_B, Board.RANK_2)
        ), IllegalMoveError);
        assert.doesNotThrow(() => position1.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_E, Board.RANK_3)
        ), IllegalMoveError);
        assert.doesNotThrow(() => position1.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_A, Board.RANK_7)
        ), IllegalMoveError);
        assert.doesNotThrow(() => position1.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_H, Board.RANK_8)
        ), IllegalMoveError);
        assert.throws(() => position1.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_A, Board.RANK_4)
        ), IllegalMoveError);
        assert.throws(() => position1.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_D, Board.RANK_6)
        ), IllegalMoveError);
        assert.throws(() => position1.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_F, Board.RANK_5)
        ), IllegalMoveError);
        assert.throws(() => position1.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_H, Board.RANK_3)
        ), IllegalMoveError);

        const position2 = Position.fromFEN('4k3/8/8/8/3b4/8/8/4K3 b - - 0 1');
        assert.doesNotThrow(() => position2.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_B, Board.RANK_2)
        ), IllegalMoveError);
        assert.doesNotThrow(() => position2.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_E, Board.RANK_3)
        ), IllegalMoveError);
        assert.doesNotThrow(() => position2.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_A, Board.RANK_7)
        ), IllegalMoveError);
        assert.doesNotThrow(() => position2.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_H, Board.RANK_8)
        ), IllegalMoveError);
        assert.throws(() => position2.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_A, Board.RANK_4)
        ), IllegalMoveError);
        assert.throws(() => position2.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_D, Board.RANK_6)
        ), IllegalMoveError);
        assert.throws(() => position2.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_F, Board.RANK_5)
        ), IllegalMoveError);
        assert.throws(() => position2.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_H, Board.RANK_3)
        ), IllegalMoveError);
    });

    // test for forbidden friend piece capture is in simplePositionTest.js file.
    it('can capture the first obstacle on its path but do not jump over', function () {
        const position1 = Position.fromFEN('4k2n/6q1/5r2/2r5/3B4/8/1p3n2/b3K3 w - - 0 1');
        assert.doesNotThrow(() => position1.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_B, Board.RANK_2)
        ), IllegalMoveError);
        assert.doesNotThrow(() => position1.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_C, Board.RANK_5)
        ), IllegalMoveError);
        assert.doesNotThrow(() => position1.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_F, Board.RANK_6)
        ), IllegalMoveError);
        assert.doesNotThrow(() => position1.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_F, Board.RANK_2)
        ), IllegalMoveError);
        assert.throws(() => position1.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_H, Board.RANK_8)
        ), IllegalMoveError);
        assert.throws(() => position1.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_A, Board.RANK_1)
        ), IllegalMoveError);
        assert.throws(() => position1.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_A, Board.RANK_7)
        ), IllegalMoveError);
        assert.throws(() => position1.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_G, Board.RANK_1)
        ), IllegalMoveError);

        const position2 = Position.fromFEN('4k2N/6Q1/5R2/2R5/3b4/8/1P3N2/B3K3 b - - 0 1');
        assert.doesNotThrow(() => position2.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_B, Board.RANK_2)
        ), IllegalMoveError);
        assert.doesNotThrow(() => position2.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_C, Board.RANK_5)
        ), IllegalMoveError);
        assert.doesNotThrow(() => position2.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_F, Board.RANK_6)
        ), IllegalMoveError);
        assert.doesNotThrow(() => position2.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_F, Board.RANK_2)
        ), IllegalMoveError);
        assert.throws(() => position2.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_H, Board.RANK_8)
        ), IllegalMoveError);
        assert.throws(() => position2.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_A, Board.RANK_1)
        ), IllegalMoveError);
        assert.throws(() => position2.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_A, Board.RANK_7)
        ), IllegalMoveError);
        assert.throws(() => position2.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_G, Board.RANK_1)
        ), IllegalMoveError);
    })
});

describe('Rook', function () {
    it('should produce valid FEN string', function () {
        assert.equal('R', new Rook(true).toFEN());
        assert.equal('r', new Rook(false).toFEN());
    });

    it('can move in horizontal/vertical line as far as the path is free', function () {
        const position1 = Position.fromFEN('4k3/8/8/2R5/8/8/8/4K3 w - - 0 1');
        assert.doesNotThrow(() => position1.move(
            new Cell(Board.FILE_C, Board.RANK_5),
            new Cell(Board.FILE_C, Board.RANK_7)
        ), IllegalMoveError);
        assert.doesNotThrow(() => position1.move(
            new Cell(Board.FILE_C, Board.RANK_5),
            new Cell(Board.FILE_C, Board.RANK_1)
        ), IllegalMoveError);
        assert.doesNotThrow(() => position1.move(
            new Cell(Board.FILE_C, Board.RANK_5),
            new Cell(Board.FILE_A, Board.RANK_5)
        ), IllegalMoveError);
        assert.doesNotThrow(() => position1.move(
            new Cell(Board.FILE_C, Board.RANK_5),
            new Cell(Board.FILE_F, Board.RANK_5)
        ), IllegalMoveError);
        assert.throws(() => position1.move(
            new Cell(Board.FILE_C, Board.RANK_5),
            new Cell(Board.FILE_A, Board.RANK_7)
        ), IllegalMoveError);
        assert.throws(() => position1.move(
            new Cell(Board.FILE_C, Board.RANK_5),
            new Cell(Board.FILE_G, Board.RANK_1)
        ), IllegalMoveError);
        assert.throws(() => position1.move(
            new Cell(Board.FILE_C, Board.RANK_5),
            new Cell(Board.FILE_E, Board.RANK_6)
        ), IllegalMoveError);
        assert.throws(() => position1.move(
            new Cell(Board.FILE_C, Board.RANK_5),
            new Cell(Board.FILE_E, Board.RANK_2)
        ), IllegalMoveError);

        const position2 = Position.fromFEN('4k3/8/8/2r5/8/8/8/4K3 b - - 0 1');
        assert.doesNotThrow(() => position2.move(
            new Cell(Board.FILE_C, Board.RANK_5),
            new Cell(Board.FILE_C, Board.RANK_7)
        ), IllegalMoveError);
        assert.doesNotThrow(() => position2.move(
            new Cell(Board.FILE_C, Board.RANK_5),
            new Cell(Board.FILE_C, Board.RANK_1)
        ), IllegalMoveError);
        assert.doesNotThrow(() => position2.move(
            new Cell(Board.FILE_C, Board.RANK_5),
            new Cell(Board.FILE_A, Board.RANK_5)
        ), IllegalMoveError);
        assert.doesNotThrow(() => position2.move(
            new Cell(Board.FILE_C, Board.RANK_5),
            new Cell(Board.FILE_F, Board.RANK_5)
        ), IllegalMoveError);
        assert.throws(() => position2.move(
            new Cell(Board.FILE_C, Board.RANK_5),
            new Cell(Board.FILE_A, Board.RANK_7)
        ), IllegalMoveError);
        assert.throws(() => position2.move(
            new Cell(Board.FILE_C, Board.RANK_5),
            new Cell(Board.FILE_G, Board.RANK_1)
        ), IllegalMoveError);
        assert.throws(() => position2.move(
            new Cell(Board.FILE_C, Board.RANK_5),
            new Cell(Board.FILE_E, Board.RANK_6)
        ), IllegalMoveError);
        assert.throws(() => position2.move(
            new Cell(Board.FILE_C, Board.RANK_5),
            new Cell(Board.FILE_E, Board.RANK_2)
        ), IllegalMoveError);
    });

    // test for forbidden friend piece capture is in simplePositionTest.js file.
    it('can capture the first obstacle on its path but do not jump over', function () {
        const position1 = Position.fromFEN('5k2/8/3b4/8/q1pRNnp1/3n4/8/4K3 w - - 0 1');
        assert.doesNotThrow(() => position1.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_D, Board.RANK_3)
        ), IllegalMoveError);
        assert.doesNotThrow(() => position1.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_D, Board.RANK_6)
        ), IllegalMoveError);
        assert.doesNotThrow(() => position1.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_C, Board.RANK_4)
        ), IllegalMoveError);
        assert.throws(() => position1.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_D, Board.RANK_7)
        ), IllegalMoveError);
        assert.throws(() => position1.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_A, Board.RANK_7)
        ), IllegalMoveError);
        assert.throws(() => position1.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_G, Board.RANK_4)
        ), IllegalMoveError);
        assert.throws(() => position1.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_F, Board.RANK_4)
        ), IllegalMoveError);

        const position2 = Position.fromFEN('5k2/8/3n4/8/Q1PrnNP1/3N4/8/4K3 b - - 0 1');
        assert.doesNotThrow(() => position2.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_D, Board.RANK_3)
        ), IllegalMoveError);
        assert.doesNotThrow(() => position2.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_D, Board.RANK_6)
        ), IllegalMoveError);
        assert.doesNotThrow(() => position2.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_C, Board.RANK_4)
        ), IllegalMoveError);
        assert.throws(() => position2.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_D, Board.RANK_7)
        ), IllegalMoveError);
        assert.throws(() => position2.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_A, Board.RANK_7)
        ), IllegalMoveError);
        assert.throws(() => position2.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_G, Board.RANK_4)
        ), IllegalMoveError);
        assert.throws(() => position2.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_F, Board.RANK_4)
        ), IllegalMoveError);
    });
});

describe('Queen', function () {
    it('should produce valid FEN string', function () {
        assert.equal('Q', new Queen(true).toFEN());
        assert.equal('q', new Queen(false).toFEN());
    });

    it('can move in straight lines as far as the path is free', function () {
        const position1 = Position.fromFEN('4k3/8/8/8/3Q4/8/8/4K3 w - - 0 1');
        assert.doesNotThrow(() => position1.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_D, Board.RANK_8)
        ), IllegalMoveError);
        assert.doesNotThrow(() => position1.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_A, Board.RANK_7)
        ), IllegalMoveError);
        assert.doesNotThrow(() => position1.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_C, Board.RANK_4)
        ), IllegalMoveError);
        assert.doesNotThrow(() => position1.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_G, Board.RANK_4)
        ), IllegalMoveError);
        assert.throws(() => position1.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_C, Board.RANK_2)
        ), IllegalMoveError);
        assert.throws(() => position1.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_H, Board.RANK_5)
        ), IllegalMoveError);

        const position2 = Position.fromFEN('4k3/8/8/8/3q4/8/8/4K3 b - - 0 1');
        assert.doesNotThrow(() => position2.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_D, Board.RANK_8)
        ), IllegalMoveError);
        assert.doesNotThrow(() => position2.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_A, Board.RANK_7)
        ), IllegalMoveError);
        assert.doesNotThrow(() => position2.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_C, Board.RANK_4)
        ), IllegalMoveError);
        assert.doesNotThrow(() => position2.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_G, Board.RANK_4)
        ), IllegalMoveError);
        assert.throws(() => position2.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_C, Board.RANK_2)
        ), IllegalMoveError);
        assert.throws(() => position2.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_H, Board.RANK_5)
        ), IllegalMoveError);
    });

    // test for forbidden friend piece capture is in simplePositionTest.js file.
    it('can capture the first obstacle on its path but do not jump over', function () {
        const position1 = Position.fromFEN('4k3/6p1/3B1r2/4N3/3Qp1n1/8/1b6/4K3 w - - 0 1');
        assert.doesNotThrow(() => position1.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_E, Board.RANK_3)
        ), IllegalMoveError);
        assert.doesNotThrow(() => position1.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_B, Board.RANK_2)
        ), IllegalMoveError);
        assert.throws(() => position1.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_A, Board.RANK_1)
        ));
        assert.throws(() => position1.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_D, Board.RANK_8)
        ));
        assert.throws(() => position1.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_G, Board.RANK_4)
        ));
        assert.throws(() => position1.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_G, Board.RANK_7)
        ));

        const position2 = Position.fromFEN('4k3/6P1/3b1R2/4n3/3qP1N1/8/1B6/4K3 b - - 0 1');
        assert.doesNotThrow(() => position2.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_E, Board.RANK_3)
        ), IllegalMoveError);
        assert.doesNotThrow(() => position2.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_B, Board.RANK_2)
        ), IllegalMoveError);
        assert.throws(() => position2.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_A, Board.RANK_1)
        ));
        assert.throws(() => position2.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_D, Board.RANK_8)
        ));
        assert.throws(() => position2.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_G, Board.RANK_4)
        ));
        assert.throws(() => position2.move(
            new Cell(Board.FILE_D, Board.RANK_4),
            new Cell(Board.FILE_G, Board.RANK_7)
        ));
    });
});

describe('King', function () {
    it('should produce valid FEN string', function () {
        assert.equal('K', new King(true).toFEN());
        assert.equal('k', new King(false).toFEN());
    });

    it('can move one cell in all directions', function () {
        const position1 = Position.fromFEN('4k3/8/8/8/8/2K5/8/8 w - - 0 1');
        assert.doesNotThrow(() => position1.move(
            new Cell(Board.FILE_C, Board.RANK_3),
            new Cell(Board.FILE_B, Board.RANK_4)
        ), IllegalMoveError);
        assert.doesNotThrow(() => position1.move(
            new Cell(Board.FILE_C, Board.RANK_3),
            new Cell(Board.FILE_C, Board.RANK_4)
        ), IllegalMoveError);
        assert.doesNotThrow(() => position1.move(
            new Cell(Board.FILE_C, Board.RANK_3),
            new Cell(Board.FILE_D, Board.RANK_4)
        ), IllegalMoveError);
        assert.doesNotThrow(() => position1.move(
            new Cell(Board.FILE_C, Board.RANK_3),
            new Cell(Board.FILE_B, Board.RANK_3)
        ), IllegalMoveError);
        assert.doesNotThrow(() => position1.move(
            new Cell(Board.FILE_C, Board.RANK_3),
            new Cell(Board.FILE_D, Board.RANK_3)
        ), IllegalMoveError);
        assert.doesNotThrow(() => position1.move(
            new Cell(Board.FILE_C, Board.RANK_3),
            new Cell(Board.FILE_B, Board.RANK_2)
        ), IllegalMoveError);
        assert.doesNotThrow(() => position1.move(
            new Cell(Board.FILE_C, Board.RANK_3),
            new Cell(Board.FILE_C, Board.RANK_2)
        ), IllegalMoveError);
        assert.doesNotThrow(() => position1.move(
            new Cell(Board.FILE_C, Board.RANK_3),
            new Cell(Board.FILE_D, Board.RANK_2)
        ), IllegalMoveError);
        assert.throws(() => position1.move(
            new Cell(Board.FILE_C, Board.RANK_3),
            new Cell(Board.FILE_C, Board.RANK_5)
        ));
        assert.throws(() => position1.move(
            new Cell(Board.FILE_C, Board.RANK_3),
            new Cell(Board.FILE_C, Board.RANK_8)
        ));
        assert.throws(() => position1.move(
            new Cell(Board.FILE_C, Board.RANK_3),
            new Cell(Board.FILE_G, Board.RANK_3)
        ));
        assert.throws(() => position1.move(
            new Cell(Board.FILE_C, Board.RANK_3),
            new Cell(Board.FILE_H, Board.RANK_3)
        ));
        assert.throws(() => position1.move(
            new Cell(Board.FILE_C, Board.RANK_3),
            new Cell(Board.FILE_C, Board.RANK_1)
        ));
        assert.throws(() => position1.move(
            new Cell(Board.FILE_C, Board.RANK_3),
            new Cell(Board.FILE_A, Board.RANK_3)
        ));

        const position2 = Position.fromFEN('8/8/8/8/7K/2k5/8/8 b - - 0 1');
        assert.doesNotThrow(() => position2.move(
            new Cell(Board.FILE_C, Board.RANK_3),
            new Cell(Board.FILE_B, Board.RANK_4)
        ), IllegalMoveError);
        assert.doesNotThrow(() => position2.move(
            new Cell(Board.FILE_C, Board.RANK_3),
            new Cell(Board.FILE_C, Board.RANK_4)
        ), IllegalMoveError);
        assert.doesNotThrow(() => position2.move(
            new Cell(Board.FILE_C, Board.RANK_3),
            new Cell(Board.FILE_D, Board.RANK_4)
        ), IllegalMoveError);
        assert.doesNotThrow(() => position2.move(
            new Cell(Board.FILE_C, Board.RANK_3),
            new Cell(Board.FILE_B, Board.RANK_3)
        ), IllegalMoveError);
        assert.doesNotThrow(() => position2.move(
            new Cell(Board.FILE_C, Board.RANK_3),
            new Cell(Board.FILE_D, Board.RANK_3)
        ), IllegalMoveError);
        assert.doesNotThrow(() => position2.move(
            new Cell(Board.FILE_C, Board.RANK_3),
            new Cell(Board.FILE_B, Board.RANK_2)
        ), IllegalMoveError);
        assert.doesNotThrow(() => position2.move(
            new Cell(Board.FILE_C, Board.RANK_3),
            new Cell(Board.FILE_C, Board.RANK_2)
        ), IllegalMoveError);
        assert.doesNotThrow(() => position2.move(
            new Cell(Board.FILE_C, Board.RANK_3),
            new Cell(Board.FILE_D, Board.RANK_2)
        ), IllegalMoveError);
        assert.throws(() => position2.move(
            new Cell(Board.FILE_C, Board.RANK_3),
            new Cell(Board.FILE_C, Board.RANK_5)
        ));
        assert.throws(() => position2.move(
            new Cell(Board.FILE_C, Board.RANK_3),
            new Cell(Board.FILE_C, Board.RANK_8)
        ));
        assert.throws(() => position2.move(
            new Cell(Board.FILE_C, Board.RANK_3),
            new Cell(Board.FILE_G, Board.RANK_3)
        ));
        assert.throws(() => position2.move(
            new Cell(Board.FILE_C, Board.RANK_3),
            new Cell(Board.FILE_H, Board.RANK_3)
        ));
        assert.throws(() => position2.move(
            new Cell(Board.FILE_C, Board.RANK_3),
            new Cell(Board.FILE_C, Board.RANK_1)
        ));
        assert.throws(() => position2.move(
            new Cell(Board.FILE_C, Board.RANK_3),
            new Cell(Board.FILE_A, Board.RANK_3)
        ));
    });



    // todo test for move letting it in check
});