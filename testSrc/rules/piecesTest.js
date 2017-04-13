import {expect, assert} from 'chai';
import {Piece, Pawn} from '../../lib/rules/pieces.js';

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