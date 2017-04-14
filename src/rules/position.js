import {Piece} from './pieces';

export class Board {

    constructor(){
        this.values = Array.from([0,1,2,3,4,5,6,7], x => [null, null, null, null, null, null, null, null]);
    }

    /**
     * Builds board from FEN string
     * see https://goo.gl/nWOyYO
     * @param {String} fen 
     */
    static fromFEN(fen){
        const boardFEN = fen.split(/\s+/)[0];
        const boardLines = boardFEN.split('/');
        const values = [];

        for (let lineIndex in boardLines){
            const lineCells = [];
            const line = boardLines[lineIndex];

            for (let cellValue of line){
                const holesNumber = parseInt(cellValue);
                const isNumber = !isNaN(holesNumber);
                if (isNumber){
                    for (let time = 0; time < holesNumber; time++) lineCells.push(null);
                }
                else {
                    lineCells.push(Piece.fromFEN(cellValue));
                }
            }

            values.push(lineCells);
        }

        const boardToReturn = new Board();
        boardToReturn.values = values;
        return boardToReturn;
    }

    /**
     * see https://goo.gl/nWOyYO
     */
    toFEN(){
        let stringToReturn = "";

        for (let rank = 7; rank >= 0 ; rank--){
            let holesNumber = 0;
            for (let file = 0; file < 8; file++){
                const cell = this.values[rank][file];
                if (cell == null){
                    holesNumber++;
                }
                else {
                    if (holesNumber > 0) stringToReturn += `${holesNumber}`;
                    holesNumber = 0;
                    stringToReturn += cell.toFEN();
                }
            }
            if (holesNumber > 0) stringToReturn += `${holesNumber}`;
            if (rank > 0) stringToReturn += '/';
        }

        return stringToReturn;
    }

    static get FILE_A(){ return 0; }
    static get FILE_B(){ return 1; }
    static get FILE_C(){ return 2; }
    static get FILE_D(){ return 3; }
    static get FILE_E(){ return 4; }
    static get FILE_F(){ return 5; }
    static get FILE_G(){ return 6; }
    static get FILE_H(){ return 7; }

    static get RANK_1(){ return 0; }
    static get RANK_2(){ return 1; }
    static get RANK_3(){ return 2; }
    static get RANK_4(){ return 3; }
    static get RANK_5(){ return 4; }
    static get RANK_6(){ return 5; }
    static get RANK_7(){ return 6; }
    static get RANK_8(){ return 7; }


}

/**
 * Stores castle availabilities for both players
 */
export class CastleRights {

    /**
     * 
     * @param {boolean} whiteKingSide 
     * @param {boolean} whiteQueenSide 
     * @param {boolean} blackKingSide 
     * @param {boolean} blackQueenSide 
     */
    constructor(whiteKingSide, whiteQueenSide, blackKingSide, blackQueenSide){
        this.whiteKingSide = whiteKingSide;
        this.whiteQueenSide = whiteQueenSide;
        this.blackKingSide = blackKingSide;
        this.blackQueenSide = blackQueenSide;
    }

    /**
     * Builds from a FEN string.
     * See https://goo.gl/nWOyYO
     * @param {String} fen - a complete FEN string, not just the castle rights part.
     */
    static fromFEN(fen) {
        const castlePart = fen.split(/\s+/)[2];
        return new CastleRights(castlePart.includes('K'), castlePart.includes('Q'),
         castlePart.includes('k'), castlePart.includes('q'));
    }

    /**
     * Generates the castles right part of FEN specification.
     * See https://goo.gl/nWOyYO
     */
    toFEN(){
        let stringToReturn = '';

        if (this.whiteKingSide) stringToReturn += 'K';
        if (this.whiteQueenSide) stringToReturn += 'Q';
        if (this.blackKingSide) stringToReturn += 'k';
        if (this.blackQueenSide) stringToReturn += 'q';

        return stringToReturn ? stringToReturn : '-';
    }

}

/**
 * Game info part of a position : all but board value (pieces locations).
 */
export class GameInfo {

    /**
     * 
     * @param {boolean} whiteTurn 
     * @param {CastleRights} castlesRights 
     * @param {Integer} enPassantFile - can be null
     * @param {Integer} nullityHalfMovesCount - half moves number since last capture or pawn move.
     * @param {Integer} moveNumber 
     */
    constructor(whiteTurn, castlesRights, enPassantFile, nullityHalfMovesCount, moveNumber){
        this.whiteTurn = whiteTurn;
        this.castlesRights = castlesRights;
        this.enPassantFile = enPassantFile;
        this.nullityHalfMovesCount = nullityHalfMovesCount;
        this.moveNumber = moveNumber;
    }

    /**
     * Builds from a FEN string.
     * See https://goo.gl/nWOyYO
     * @param {String} fen 
     */
    static fromFEN(fen){
        const fenParts = fen.split(/\s+/);

        const whiteTurn = fenParts[1] === 'w';
        const castlesRights = CastleRights.fromFEN(fen);
        const enPassantFile = fenParts[3] == '-' ? null : fenParts[3].charCodeAt(0) - 'a'.charCodeAt(0);
        const nullityHalfMovesCount = parseInt(fenParts[4]);
        const moveNumber = parseInt(fenParts[5]);

        return new GameInfo(whiteTurn, castlesRights, enPassantFile, nullityHalfMovesCount, moveNumber);
    }

    /**
     * Generates the game info part (all but the board part) of FEN specification.
     * See https://goo.gl/nWOyYO
     */
    toFEN(){
        const OneCharCode = 49;
        const LetterACharCode = 97;

        const whiteTurnStr = this.whiteTurn ? 'w' : 'b';
        const castleRightsStr = this.castlesRights.toFEN();
        let enPassantFileStr = '-';
        if (this.enPassantFile){
            const fileStr = String.fromCharCode(LetterACharCode + this.enPassantFile);
            const rankValue = this.whiteTurn ? Board.RANK_6 : Board.RANK_3;
            const rankStr = String.fromCharCode(OneCharCode + rankValue);
            enPassantFileStr = `${fileStr}${rankStr}`;
        }
        const nullityHalfMovesCountStr = this.nullityHalfMovesCount.toString();
        const moveNumberStr = this.moveNumber.toString();

        return `${whiteTurnStr} ${castleRightsStr} ${enPassantFileStr} ${nullityHalfMovesCountStr} ${moveNumberStr}`;
    }
}