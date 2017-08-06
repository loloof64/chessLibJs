import _ from 'lodash';
import { Piece, Queen } from './pieces';

export class Cell {
    constructor(file, rank) {
        this.file = file;
        this.rank = rank;
    }
}

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

export class IllegalMoveError {
    constructor(message) {
        this.message = message;
    }
};

IllegalMoveError.prototype = Object.create(Error.prototype);
IllegalMoveError.prototype.constructor = IllegalMoveError;

export class CannotMoveFromEmptyCellError {
    constructor(message) {
        this.message = message;
    }
};

CannotMoveFromEmptyCellError.prototype = Object.create(Error.prototype);
CannotMoveFromEmptyCellError.prototype.constructor = CannotMoveFromEmptyCellError;

export class IllegalPositionError {
    constructor(message) {
        this.message = message;
    }
};

IllegalPositionError.prototype = Object.create(Error.prototype);
IllegalPositionError.prototype.constructor = IllegalPositionError;

export class WrongKingsCountError {
    constructor(message) {
        this.message = message;
    }
}
WrongKingsCountError.prototype = Object.create(IllegalPositionError.prototype);
WrongKingsCountError.prototype.constructor = WrongKingsCountError;

export class PawnOnFirstOrEightRankError {
    constructor(message) {
        this.message = message;
    }
}
PawnOnFirstOrEightRankError.prototype = Object.create(IllegalPositionError.prototype);
PawnOnFirstOrEightRankError.prototype.constructor = PawnOnFirstOrEightRankError;

export class BadCastleFlagsFormatError {
    constructor(message) {
        this.message = message;
    }
}
BadCastleFlagsFormatError.prototype = Object.create(IllegalPositionError.prototype);
BadCastleFlagsFormatError.prototype.constructor = BadCastleFlagsFormatError;

export class ForbiddenCastleFlagsError {
    constructor(message) {
        this.message = message;
    }
}
ForbiddenCastleFlagsError.prototype = Object.create(IllegalPositionError.prototype);
ForbiddenCastleFlagsError.prototype.constructor = ForbiddenCastleFlagsError;

export class PlayerTurnFormatError {
    constructor(message) {
        this.message = message;
    }
}
PlayerTurnFormatError.prototype = Object.create(IllegalPositionError.prototype);
PlayerTurnFormatError.prototype.constructor = PlayerTurnFormatError;

export class EnPassantCellFormatError {
    constructor(message) {
        this.message = message;
    }
}
EnPassantCellFormatError.prototype = Object.create(IllegalPositionError.prototype);
EnPassantCellFormatError.prototype.constructor = EnPassantCellFormatError;

export class ForbiddenEnPassantCellError {
    constructor(message) {
        this.message = message;
    }
}
ForbiddenEnPassantCellError.prototype = Object.create(IllegalPositionError.prototype);
ForbiddenEnPassantCellError.prototype.constructor = ForbiddenEnPassantCellError;

export class WrongNullityHalfMovesCountError {
    constructor(message) {
        this.message = message;
    }
}
WrongNullityHalfMovesCountError.prototype = Object.create(IllegalPositionError.prototype);
WrongNullityHalfMovesCountError.prototype.constructor = WrongNullityHalfMovesCountError;

export class WrongMoveNumberError {
    constructor(message) {
        this.message = message;
    }
}
WrongMoveNumberError.prototype = Object.create(IllegalPositionError.prototype);
WrongMoveNumberError.prototype.constructor = WrongMoveNumberError;

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
        Position.checkIfFenIsValid_(fen);
        return new Position(Board.fromFEN(fen), GameInfo.fromFEN(fen));
    }

    /**
     * Generates the FEN string.
     * See https://goo.gl/nWOyYO
     */
    toFEN() {
        return `${this.board.toFEN()} ${this.gameInfo.toFEN()}`;
    }

    countObstacleInPathExcludingEndCell_(fromCell, toCell) {
        const deltaFile = toCell.file - fromCell.file;
        const deltaRank = toCell.rank - fromCell.rank;
        const absDeltaFile = Math.abs(deltaFile);
        const absDeltaRank = Math.abs(deltaRank);

        const staysAtStartCell = absDeltaFile == 0 && absDeltaRank == 0;
        const notARegularLine = (absDeltaFile > 0 && absDeltaRank > 0) && (absDeltaFile != absDeltaRank);
        if (staysAtStartCell || notARegularLine) return 0;

        let count = 0;
        let currentFile = fromCell.file;
        let currentRank = fromCell.rank;
        const fileStep = absDeltaFile > 0 ? parseInt(deltaFile / absDeltaFile) : 0; // must be -1,1 or 0
        const rankStep = absDeltaRank > 0 ? parseInt(deltaRank / absDeltaRank) : 0; // must be -1,1 or 0

        while (true) {
            currentFile += fileStep;
            currentRank += rankStep;
            if (currentFile === toCell.file && currentRank === toCell.rank) break;
            const pieceAtCurrentCellNotEmpty = this.board.values[currentRank][currentFile] !== null;
            if (pieceAtCurrentCellNotEmpty) count++;
        }

        return count;
    }

    move(fromCell, toCell, promotionPiece, checkIfKingInChessAfterMove) {
        const movingPiece = this.board.values[fromCell.rank][fromCell.file];
        if (movingPiece === null) throw new CannotMoveFromEmptyCellError();

        const deltaFile = toCell.file - fromCell.file;
        const deltaRank = toCell.rank - fromCell.rank;
        const absDeltaFile = Math.abs(deltaFile);
        const absDeltaRank = Math.abs(deltaRank);

        let isRightPath;

        switch (movingPiece.toFEN()) {
            case 'N': //wanted fall through
            case 'n':
                isRightPath = (absDeltaFile == 2 && absDeltaRank == 1) || (absDeltaFile == 1 && absDeltaRank == 2);
                if (!isRightPath) throw new IllegalMoveError();
                break;
            case 'B': //wanted fall through
            case 'b':
                isRightPath = absDeltaFile == absDeltaRank;
                if (!isRightPath) throw new IllegalMoveError();
                if (this.countObstacleInPathExcludingEndCell_(fromCell, toCell) > 0) throw new IllegalMoveError();
                break;
            case 'R': //wanted fall through
            case 'r':
                isRightPath = absDeltaFile == 0 || absDeltaRank == 0;
                if (!isRightPath) throw new IllegalMoveError();
                if (this.countObstacleInPathExcludingEndCell_(fromCell, toCell) > 0) throw new IllegalMoveError();
                break;
        }
    }

    static newBuilder() {
        return new PositionBuilder();
    }

    static checkIfFenIsValid_(fenString) {
        const parts = fenString.split(' ');
        const piecesArray = Position.convertFenStringToPiecesArray_(fenString);

        const whiteKingCount = Position.countThisPieceInstancesInArray_(Piece.fromFEN('K'), _.flatten(piecesArray));
        const blackKingCount = Position.countThisPieceInstancesInArray_(Piece.fromFEN('k'), _.flatten(piecesArray));

        if (whiteKingCount !== 1 || blackKingCount !== 1) throw new WrongKingsCountError();

        const pawnsOnFirstRankCount =
            Position.countThisPieceInstancesInArray_(Piece.fromFEN('P'), piecesArray[Board.RANK_1]) +
            Position.countThisPieceInstancesInArray_(Piece.fromFEN('p'), piecesArray[Board.RANK_1]);

        const pawnsOnEightRankCount =
            Position.countThisPieceInstancesInArray_(Piece.fromFEN('P'), piecesArray[Board.RANK_8]) +
            Position.countThisPieceInstancesInArray_(Piece.fromFEN('p'), piecesArray[Board.RANK_8]);

        if (pawnsOnFirstRankCount > 0 || pawnsOnEightRankCount > 0) throw new PawnOnFirstOrEightRankError();

        const goodPlayerTurn = parts[1] === 'w' || parts[1] === 'b';
        if (!goodPlayerTurn) throw new PlayerTurnFormatError();

        const goodAvailableCastlesCode = parts[2] === '-' ||
            (parts[2].length >= 1 && parts[2].length <= 4 &&
                _.every(parts[2], (charElt) => (charElt === 'K' || charElt === 'Q' || charElt === 'k' || charElt === 'q')));

        if (!goodAvailableCastlesCode) throw new BadCastleFlagsFormatError();

        let castleCodesFlagsAreAllAllowed = true;
        if (_.includes(parts[2], 'K') && (piecesArray[Board.RANK_1][Board.FILE_E] == null || piecesArray[Board.RANK_1][Board.FILE_E].toFEN() !== 'K')) castleCodesFlagsAreAllAllowed = false;
        if (_.includes(parts[2], 'K') && (piecesArray[Board.RANK_1][Board.FILE_H] == null || piecesArray[Board.RANK_1][Board.FILE_H].toFEN() !== 'R')) castleCodesFlagsAreAllAllowed = false;
        if (_.includes(parts[2], 'Q') && (piecesArray[Board.RANK_1][Board.FILE_E] == null || piecesArray[Board.RANK_1][Board.FILE_E].toFEN() !== 'K')) castleCodesFlagsAreAllAllowed = false;
        if (_.includes(parts[2], 'Q') && (piecesArray[Board.RANK_1][Board.FILE_A] == null || piecesArray[Board.RANK_1][Board.FILE_A].toFEN() !== 'R')) castleCodesFlagsAreAllAllowed = false;
        if (_.includes(parts[2], 'k') && (piecesArray[Board.RANK_8][Board.FILE_E] == null || piecesArray[Board.RANK_8][Board.FILE_E].toFEN() !== 'k')) castleCodesFlagsAreAllAllowed = false;
        if (_.includes(parts[2], 'k') && (piecesArray[Board.RANK_8][Board.FILE_H] == null || piecesArray[Board.RANK_8][Board.FILE_H].toFEN() !== 'r')) castleCodesFlagsAreAllAllowed = false;
        if (_.includes(parts[2], 'q') && (piecesArray[Board.RANK_8][Board.FILE_E] == null || piecesArray[Board.RANK_8][Board.FILE_E].toFEN() !== 'k')) castleCodesFlagsAreAllAllowed = false;
        if (_.includes(parts[2], 'q') && (piecesArray[Board.RANK_8][Board.FILE_A] == null || piecesArray[Board.RANK_8][Board.FILE_A].toFEN() !== 'r')) castleCodesFlagsAreAllAllowed = false;

        if (!castleCodesFlagsAreAllAllowed) throw new ForbiddenCastleFlagsError();

        const asciiCodeForLowerCaseA = 97;
        const noEnPassantSquareDefined = parts[3] === '-';
        const enPassantSquareWellFormatted = parts[1] === 'w' ? parts[3].match(/[a-h]6/) : parts[3].match(/[a-h]3/);
        const enPassantFile = enPassantSquareWellFormatted ? Board.FILE_A + parts[3].charCodeAt(0) - asciiCodeForLowerCaseA : null;
        const enPassantRank = parts[1] === 'w' ? Board.RANK_5 : Board.RANK_4;
        const pieceAboveBelowEnPassantCell = (enPassantFile && !noEnPassantSquareDefined) ? (piecesArray[enPassantRank][enPassantFile]) : null;
        const expectedPawnFEN = parts[1] === 'w' ? 'p' : 'P';
        const pieceAboveBelowEnPassantCellIsExpectedPiece = pieceAboveBelowEnPassantCell && (pieceAboveBelowEnPassantCell.toFEN() === expectedPawnFEN);

        if (!noEnPassantSquareDefined && !enPassantSquareWellFormatted) throw new EnPassantCellFormatError();
        if (!noEnPassantSquareDefined && !pieceAboveBelowEnPassantCellIsExpectedPiece) throw new ForbiddenEnPassantCellError();

        let goodNullityHalfMovesCount;
        try {
            goodNullityHalfMovesCount = parseInt(parts[4]) >= 0;
        } catch (ex) {
            return false;
        }
        if (!goodNullityHalfMovesCount) throw new WrongNullityHalfMovesCountError();

        let goodMoveNumber;
        try {
            goodMoveNumber = parseInt(parts[5]) > 0;
        } catch (ex) {
            return false;
        }
        if (!goodMoveNumber) throw new WrongMoveNumberError();
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