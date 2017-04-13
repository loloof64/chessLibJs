export class Piece {
    constructor(whiteTurn){
        if (new.target === Piece){
            throw TypeError('Cannot instantiate Piece directly.')
        }
        this.whiteTurn = whiteTurn;
    }

    toFEN(){
        return "";
    }
}

export class Pawn extends Piece {
    constructor(whiteTurn){
        super(whiteTurn);
    }

    toFEN(){
        return this.whiteTurn ? 'P' : 'p';
    }
}