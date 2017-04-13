import {InstantiationError, UnknownPieceFENError} from '../errors/errors';

export class Piece {
    constructor(whiteTurn){
        if (new.target === Piece){
            throw new InstantiationError('Piece');
        }
        this.whiteTurn = whiteTurn;
    }

    /**
     * See https://goo.gl/nWOyYO
     */
    toFEN(){
        return "";
    }

    static fromFEN(pieceFEN){
        switch(pieceFEN){
            case 'P': return new Pawn(true);
            case 'p': return new Pawn(false);
            case 'N': return new Knight(true);
            case 'n': return new Knight(false);
            case 'B': return new Bishop(true);
            case 'b': return new Bishop(false);
            case 'R': return new Rook(true);
            case 'r': return new Rook(false);
            case 'Q': return new Queen(true);
            case 'q': return new Queen(false);
            case 'K': return new King(true);
            case 'k': return new King(false);
            default: throw new UnknownPieceFENError(`${pieceFEN}`);
        }
    }
};

export class Pawn extends Piece {
    constructor(whiteTurn){
        super(whiteTurn);
    }

    toFEN(){
        return this.whiteTurn ? 'P' : 'p';
    }
};

export class Knight extends Piece {
    constructor(whiteTurn){
        super(whiteTurn);
    }

    toFEN(){
        return this.whiteTurn ? 'N' : 'n';
    }
};

export class Bishop extends Piece {
    constructor(whiteTurn){
        super(whiteTurn);
    }

    toFEN(){
        return this.whiteTurn ? 'B' : 'b';
    }
};

export class Rook extends Piece {
    constructor(whiteTurn){
        super(whiteTurn);
    }

    toFEN(){
        return this.whiteTurn ? 'R' : 'r';
    }
};

export class Queen extends Piece {
    constructor(whiteTurn){
        super(whiteTurn);
    }

    toFEN(){
        return this.whiteTurn ? 'Q' : 'q';
    }
};

export class King extends Piece {
    constructor(whiteTurn){
        super(whiteTurn);
    }

    toFEN(){
        return this.whiteTurn ? 'K' : 'k';
    }
}