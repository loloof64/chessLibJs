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

        for (let line in boardLines){
            const lineCells = [];
            const line = boardLines[line];

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

}