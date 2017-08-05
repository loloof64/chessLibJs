import _ from 'lodash';
import { Piece } from './pieces';

export class Board {

    constructor() {
        this.values = Array.from([0, 1, 2, 3, 4, 5, 6, 7], x => [null, null, null, null, null, null, null, null]);
    }

    /**
     * Builds board from FEN string
     * see https://goo.gl/nWOyYO
     * @param {String} fen 
     */
    static fromFEN(fen) {
        const boardFEN = fen.split(/\s+/)[0];
        const boardLines = boardFEN.split('/').reverse();
        const values = [];

        for (let lineIndex in boardLines) {
            const lineCells = [];
            const lineValues = boardLines[lineIndex].split('');

            for (let cellIndex in lineValues) {
                const cellValue = lineValues[cellIndex];
                const holesNumber = parseInt(cellValue);
                const isNumber = !isNaN(holesNumber);
                if (isNumber) {
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
    toFEN() {
        return Board.toFEN(this.values);
    }

    static toFEN(values) {
        let stringToReturn = "";

        for (let rank = 7; rank >= 0; rank--) {
            let holesNumber = 0;
            for (let file = 0; file < 8; file++) {
                const cell = values[rank][file];
                if (cell == null) {
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

    static get FILE_A() { return 0; }
    static get FILE_B() { return 1; }
    static get FILE_C() { return 2; }
    static get FILE_D() { return 3; }
    static get FILE_E() { return 4; }
    static get FILE_F() { return 5; }
    static get FILE_G() { return 6; }
    static get FILE_H() { return 7; }

    static get RANK_1() { return 0; }
    static get RANK_2() { return 1; }
    static get RANK_3() { return 2; }
    static get RANK_4() { return 3; }
    static get RANK_5() { return 4; }
    static get RANK_6() { return 5; }
    static get RANK_7() { return 6; }
    static get RANK_8() { return 7; }


};

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
    constructor(whiteKingSide, whiteQueenSide, blackKingSide, blackQueenSide) {
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
    toFEN() {
        let stringToReturn = '';

        if (this.whiteKingSide) stringToReturn += 'K';
        if (this.whiteQueenSide) stringToReturn += 'Q';
        if (this.blackKingSide) stringToReturn += 'k';
        if (this.blackQueenSide) stringToReturn += 'q';

        return stringToReturn ? stringToReturn : '-';
    }

};

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
    constructor(whiteTurn, castlesRights, enPassantFile, nullityHalfMovesCount, moveNumber) {
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
    static fromFEN(fen) {
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
    toFEN() {
        const OneCharCode = 49;
        const LetterACharCode = 97;

        const whiteTurnStr = this.whiteTurn ? 'w' : 'b';
        const castleRightsStr = this.castlesRights.toFEN();
        let enPassantFileStr = '-';
        if (this.enPassantFile) {
            const fileStr = String.fromCharCode(LetterACharCode + this.enPassantFile);
            const rankValue = this.whiteTurn ? Board.RANK_6 : Board.RANK_3;
            const rankStr = String.fromCharCode(OneCharCode + rankValue);
            enPassantFileStr = `${fileStr}${rankStr}`;
        }
        const nullityHalfMovesCountStr = this.nullityHalfMovesCount.toString();
        const moveNumberStr = this.moveNumber.toString();

        return `${whiteTurnStr} ${castleRightsStr} ${enPassantFileStr} ${nullityHalfMovesCountStr} ${moveNumberStr}`;
    }
};

export class IllegalPositionError {
    constructor(message) {
        this.message = message;
    }
};

IllegalPositionError.prototype = Object.create(Error.prototype);
IllegalPositionError.prototype.constructor = IllegalPositionError;

export class PositionBuilder {
    constructor() {
        this.pieces_ = Array.from([0, 1, 2, 3, 4, 5, 6, 7], x => [null, null, null, null, null, null, null, null]);
        this.whiteTurn_ = true;
        this.castlesRights_ = [false, false, false, false];
        this.enPassantFile_ = null;
        this.nullityHalfMovesCount_ = 0;
        this.moveNumber_ = 1;
    }

    setWhiteTurn(isWhite) {
        this.whiteTurn_ = isWhite;
        return this;
    }

    setCastle(type, isSet) {
        switch (type) {
            case 'K':
                this.castlesRights_[0] = isSet;
                break;
            case 'Q':
                this.castlesRights_[1] = isSet;
                break;
            case 'k':
                this.castlesRights_[2] = isSet;
                break;
            case 'q':
                this.castlesRights_[3] = isSet;
                break;
        }
        return this;
    }

    setEnPassantFile(file) {
        if (file >= Board.FILE_A && file <= Board.FILE_H) {
            this.enPassantFile_ = file;
        }
        return this;
    }

    setPiece(pieceFen, file, rank) {
        this.pieces_[rank][file] = pieceFen ? Piece.fromFEN(pieceFen) : null;
        return this;
    }

    setNullityHalfMovesCount(newCount) {
        if (newCount >= 0) {
            this.nullityHalfMovesCount_ = newCount;
        }
        return this;
    }

    setMoveNumber(newValue) {
        if (newValue > 0) this.moveNumber_ = newValue;
        return this;
    }

    build() {
        const turnString = this.whiteTurn_ ? 'w' : 'b';

        let castlesString = "";
        if (this.castlesRights_[0]) castlesString += "K";
        if (this.castlesRights_[1]) castlesString += "Q";
        if (this.castlesRights_[2]) castlesString += "k";
        if (this.castlesRights_[3]) castlesString += "q";
        if (castlesString.length == 0) castlesString = '-';

        const asciiCodeForLowerCaseA = 97;
        const enPassantCell = this.enPassantFile_ ?
            `${String.fromCharCode(asciiCodeForLowerCaseA + this.enPassantFile_)}${this.whiteTurn_ ? '6' : '3'}` : '-';

        return Position.fromFEN(`${Board.toFEN(this.pieces_)} ${turnString} ${castlesString} ${enPassantCell} ${this.nullityHalfMovesCount_} ${this.moveNumber_}`);
    }
}

export class Position {
    constructor(board, gameInfo) {
        this.board = board;
        this.gameInfo = gameInfo;
    }

    static get INITIAL_POSITION_FEN() {
        return 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    }

    /**
     * Builds from a FEN string.
     * See https://goo.gl/nWOyYO
     * @param {String} fen
     */
    static fromFEN(fen) {
        if (!Position.fenIsValid_(fen)) throw new IllegalPositionError(fen);
        return new Position(Board.fromFEN(fen), GameInfo.fromFEN(fen));
    }

    /**
     * Generates the FEN string.
     * See https://goo.gl/nWOyYO
     */
    toFEN() {
        return `${this.board.toFEN()} ${this.gameInfo.toFEN()}`;
    }

    static newBuilder() {
        return new PositionBuilder();
    }

    static fenIsValid_(fenString) {
        const parts = fenString.split(' ');
        const piecesArray = Position.convertFenStringToPiecesArray_(fenString);

        const whiteKingCount = Position.countThisPieceInstancesInArray_(Piece.fromFEN('K'), _.flatten(piecesArray));
        const blackKingCount = Position.countThisPieceInstancesInArray_(Piece.fromFEN('k'), _.flatten(piecesArray));

        const pawnsOnFirstRankCount =
            Position.countThisPieceInstancesInArray_(Piece.fromFEN('P'), piecesArray[Board.RANK_1]) +
            Position.countThisPieceInstancesInArray_(Piece.fromFEN('p'), piecesArray[Board.RANK_1]);

        const pawnsOnEightRankCount =
            Position.countThisPieceInstancesInArray_(Piece.fromFEN('P'), piecesArray[Board.RANK_8]) +
            Position.countThisPieceInstancesInArray_(Piece.fromFEN('p'), piecesArray[Board.RANK_8]);

        const goodPlayerTurn = parts[1] === 'w' || parts[1] === 'b';
        const goodAvailableCastlesCode = parts[2] === '-' ||
            (parts[2].length >= 1 && parts[2].length <= 4 &&
                _.every(parts[2], (charElt) => (charElt === 'K' || charElt === 'Q' || charElt === 'k' || charElt === 'q')));

        const goodEnPassantSquare = parts[3] === '-' ||
            (parts[3][0] >= 'a' && parts[3][0] <= 'h' && parts[3][1] === (parts[1] === 'w' ? '6' : '3'));

        let goodNullityHalfMovesCount;
        try {
            goodNullityHalfMovesCount = parseInt(parts[4]) >= 0;
        } catch (ex) {
            return false;
        }

        let goodMoveNumber;
        try {
            goodMoveNumber = parseInt(parts[5]) > 0;
        } catch (ex) {
            return false;
        }

        return whiteKingCount === 1 &&
            blackKingCount === 1 &&
            pawnsOnFirstRankCount === 0 &&
            pawnsOnEightRankCount === 0 &&
            goodPlayerTurn &&
            goodAvailableCastlesCode &&
            goodEnPassantSquare &&
            goodNullityHalfMovesCount &&
            goodMoveNumber;
    }

    static convertFenStringToPiecesArray_(fenString) {
        const boardPart = fenString.split(' ')[0];
        const lines = boardPart.split('/').reverse();
        return _.map(lines, function (currentLine) {
            let values = [];
            for (let fenValueIndex in currentLine) {
                const fenValue = currentLine[fenValueIndex];
                const isDigit = fenValue >= '0' && fenValue <= '9';
                if (isDigit) {
                    const loopTimes = parseInt(fenValue);
                    for (let i = 0; i < loopTimes; i++) {
                        values.push(null);
                    }
                }
                else {
                    values.push(Piece.fromFEN(fenValue));
                }
            }
            return values;
        });
    }

    static countThisPieceInstancesInArray_(pieceType, theArray) {
        return _.size(_.filter(theArray,
            (currValue) => currValue && pieceType && currValue.toFEN() === pieceType.toFEN()));
    }
};