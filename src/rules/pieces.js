export class Piece {
    constructor(whiteTurn){
        if (new.target === Piece){
            throw TypeError('Cannot instantiate Piece directly.')
        }
        this.whiteTurn = whiteTurn;
    }

    /**
     * See https://goo.gl/nWOyYO
     */
    toFEN(){
        return "";
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