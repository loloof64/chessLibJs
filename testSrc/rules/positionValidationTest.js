import { expect, assert } from 'chai';
import { Position, IllegalPositionError } from '../../lib/rules/position';

describe('Building Position from FEN', function () {
    it("Should not accept positions with wrong kings count", function () {
        const fen1 = '8/8/8/8/8/8/8/4K3 w - - 0 1';
        const fen2 = '4k3/8/8/8/8/8/8/8 w - - 0 1';
        const fen3 = '8/8/4k3/8/8/8/8/8 b - - 0 1';
        const fen4 = '4k3/8/4k3/8/8/8/8/4K3 b - - 0 1';
        const fen5 = '4k3/8/4k3/8/8/4k3/8/4K3 w - - 0 1';

        assert.throws(() => Position.fromFEN(fen1), IllegalPositionError);
        assert.throws(() => Position.fromFEN(fen2), IllegalPositionError);
        assert.throws(() => Position.fromFEN(fen3), IllegalPositionError);
        assert.throws(() => Position.fromFEN(fen4), IllegalPositionError);
        assert.throws(() => Position.fromFEN(fen5), IllegalPositionError);
    });

    // TODO : position with the king of player to play in chess

    it('Should not accept positions with pawns on 1st or 8th rank', function () {
        const fen1 = 'Pp6/K1k5/8/8/8/8/8/8 w - - 0 1';
        const fen2 = '8/K1k5/8/8/8/8/8/3p4 w - - 0 1';

        assert.throws(() => Position.fromFEN(fen1), IllegalPositionError);
        assert.throws(() => Position.fromFEN(fen2), IllegalPositionError);
    });

    it('Should not accept fen string with unrecognized player turn', function () {
        const fen1 = 'k2rr3/2pn2pp/p4p2/8/8/6P1/2P2P1P/RR4K1 W - - 13 20';
        const fen2 = 'k2rr3/2pn2pp/p4p2/8/8/6P1/2P2P1P/RR4K1 B - - 13 20';
        const fen3 = 'k2rr3/2pn2pp/p4p2/8/8/6P1/2P2P1P/RR4K1 White - - 13 20';
        const fen4 = 'k2rr3/2pn2pp/p4p2/8/8/6P1/2P2P1P/RR4K1 Black- - 13 20';
        const fen5 = 'k2rr3/2pn2pp/p4p2/8/8/6P1/2P2P1P/RR4K1 z - - 13 20';
        const fen6 = 'k2rr3/2pn2pp/p4p2/8/8/6P1/2P2P1P/RR4K1 A - - 13 20';

        assert.throws(() => Position.fromFEN(fen1), IllegalPositionError);
        assert.throws(() => Position.fromFEN(fen2), IllegalPositionError);
        assert.throws(() => Position.fromFEN(fen3), IllegalPositionError);
        assert.throws(() => Position.fromFEN(fen4), IllegalPositionError);
        assert.throws(() => Position.fromFEN(fen5), IllegalPositionError);
        assert.throws(() => Position.fromFEN(fen6), IllegalPositionError);
    });

    it('Should not accept fen string with wrong castle availabilities', function () {
        const fen1 = 'k2rr3/2pn2pp/p4p2/8/8/6P1/2P2P1P/RR4K1 w Fun - 13 20';
        const fen2 = 'k2rr3/2pn2pp/p4p2/8/8/6P1/2P2P1P/RR4K1 w * - 13 20';
        const fen3 = 'k2rr3/2pn2pp/p4p2/8/8/6P1/2P2P1P/RR4K1 w KqA - 13 20';
        const fen4 = 'k2rr3/2pn2pp/p4p2/8/8/6P1/2P2P1P/RR4K1 w -KQ - 13 20';
        const fen5 = 'k2rr3/2pn2pp/p4p2/8/8/6P1/2P2P1P/RR4K1 w KKqQk - 13 20';

        assert.throws(() => Position.fromFEN(fen1), IllegalPositionError);
        assert.throws(() => Position.fromFEN(fen2), IllegalPositionError);
        assert.throws(() => Position.fromFEN(fen3), IllegalPositionError);
        assert.throws(() => Position.fromFEN(fen4), IllegalPositionError);
        assert.throws(() => Position.fromFEN(fen5), IllegalPositionError);
    });

    it('Should not accept fen string with wrong en-passant square', function () {
        const fen1 = 'k2rr3/2pn2pp/p4p2/8/8/6P1/2P2P1P/RR4K1 w - * 13 20';
        const fen2 = 'k2rr3/2pn2pp/p4p2/8/8/6P1/2P2P1P/RR4K1 w - abc 13 20';
        const fen3 = 'k2rr3/2pn2pp/p4p2/8/8/6P1/2P2P1P/RR4K1 w - l6 13 20'; // wrong file
        const fen4 = 'k2rr3/2pn2pp/p4p2/8/8/6P1/2P2P1P/RR4K1 w - C6 13 20'; // uppercase file
        const fen5 = 'k2rr3/2pn2pp/p4p2/8/8/6P1/2P2P1P/RR4K1 w - g1 13 20'; // wrong rank
        const fen6 = 'k2rr3/2pn2pp/p4p2/8/8/6P1/2P2P1P/RR4K1 b - h5 13 20'; // wrong rank
        const fen7 = 'k2rr3/2pn2pp/p4p2/8/8/6P1/2P2P1P/RR4K1 w - c3 13 20'; // wrong rank (inversed)
        const fen8 = 'k2rr3/2pn2pp/p4p2/8/8/6P1/2P2P1P/RR4K1 b - e6 13 20'; // wrong rank (inversed)

        assert.throws(() => Position.fromFEN(fen1), IllegalPositionError);
        assert.throws(() => Position.fromFEN(fen2), IllegalPositionError);
        assert.throws(() => Position.fromFEN(fen3), IllegalPositionError);
        assert.throws(() => Position.fromFEN(fen4), IllegalPositionError);
        assert.throws(() => Position.fromFEN(fen5), IllegalPositionError);
        assert.throws(() => Position.fromFEN(fen6), IllegalPositionError);
        assert.throws(() => Position.fromFEN(fen7), IllegalPositionError);
        assert.throws(() => Position.fromFEN(fen8), IllegalPositionError);
    });

    it('Should not accept fen string with wrong nullity half moves count', function () {
        const fen1 = 'k2rr3/2pn2pp/p4p2/8/8/6P1/2P2P1P/RR4K1 w - - def 20';
        const fen2 = 'k2rr3/2pn2pp/p4p2/8/8/6P1/2P2P1P/RR4K1 w - - -10 20';

        assert.throws(() => Position.fromFEN(fen1), IllegalPositionError);
        assert.throws(() => Position.fromFEN(fen2), IllegalPositionError);
    });

    it('Should not accept fen string with wrong move number', function () {
        const fen1 = 'k2rr3/2pn2pp/p4p2/8/8/6P1/2P2P1P/RR4K1 w - - 0 def';
        const fen2 = 'k2rr3/2pn2pp/p4p2/8/8/6P1/2P2P1P/RR4K1 w - - 0 0';
        const fen3 = 'k2rr3/2pn2pp/p4p2/8/8/6P1/2P2P1P/RR4K1 w - - 0 -5';

        assert.throws(() => Position.fromFEN(fen1), IllegalPositionError);
        assert.throws(() => Position.fromFEN(fen2), IllegalPositionError);
        assert.throws(() => Position.fromFEN(fen3), IllegalPositionError);
    });

    it('Should not accept fen string with castling rights set when matching king/rook has moved', function () {
        const fen1 = 'r3k2r/8/8/8/8/8/8/R3K3 w Kq - 0 1';
        const fen2 = 'r3k2r/8/8/8/8/8/8/4K2R w Q - 0 1';
        const fen3 = 'r3k3/8/8/8/8/8/8/R3K2R w k - 0 1';
        const fen4 = '4k2r/8/8/8/8/8/8/R3K2R w q - 0 1';
        const fen5 = 'r3k2r/8/8/8/8/5K2/8/R6R w K - 0 1';
        const fen6 = 'r3k2r/8/8/8/8/5K2/8/R6R w Q - 0 1';
        const fen7 = 'r6r/2k5/8/8/8/8/8/R3K2R w k - 0 1';
        const fen8 = 'r6r/2k5/8/8/8/8/8/R3K2R w q - 0 1';

        assert.throws(() => Position.fromFEN(fen1), IllegalPositionError);
        assert.throws(() => Position.fromFEN(fen2), IllegalPositionError);
        assert.throws(() => Position.fromFEN(fen3), IllegalPositionError);
        assert.throws(() => Position.fromFEN(fen4), IllegalPositionError);
        assert.throws(() => Position.fromFEN(fen5), IllegalPositionError);
        assert.throws(() => Position.fromFEN(fen6), IllegalPositionError);
        assert.throws(() => Position.fromFEN(fen7), IllegalPositionError);
        assert.throws(() => Position.fromFEN(fen8), IllegalPositionError);
    })
});