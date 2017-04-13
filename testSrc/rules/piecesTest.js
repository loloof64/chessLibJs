import {expect, assert} from 'chai';
import {Piece, Pawn, Knight, Bishop, Rook, Queen, King} from '../../lib/rules/pieces.js';

describe('Piece', function(){
    it('cannot be instantiated', function(){
        expect(function(){new Piece(true)}).to.throw(TypeError);
        expect(function(){new Piece(false)}).to.throw(TypeError);
    });
})

describe('Pawn', function(){
    it('should produce valid FEN string', function(){
        assert.equal('P', new Pawn(true).toFEN());
        assert.equal('p', new Pawn(false).toFEN());
    });
});

describe('Knight', function(){
    it('should produce valid FEN string', function(){
        assert.equal('N', new Knight(true).toFEN());
        assert.equal('n', new Knight(false).toFEN());
    });
});

describe('Bishop', function(){
    it('should produce valid FEN string', function(){
        assert.equal('B', new Bishop(true).toFEN());
        assert.equal('b', new Bishop(false).toFEN());
    });
});

describe('Rook', function(){
    it('should produce valid FEN string', function(){
        assert.equal('R', new Rook(true).toFEN());
        assert.equal('r', new Rook(false).toFEN());
    });
});

describe('Queen', function(){
    it('should produce valid FEN string', function(){
        assert.equal('Q', new Queen(true).toFEN());
        assert.equal('q', new Queen(false).toFEN());
    });
});

describe('King', function(){
    it('should produce valid FEN string', function(){
        assert.equal('K', new King(true).toFEN());
        assert.equal('k', new King(false).toFEN());
    });
});