import { ChessPiece } from "../ChessPiece";

class Knight extends ChessPiece {
    constructor(color: 'white' | 'black' = "white"){
        super([2, 1], color);
    }

    calculateMoves(currentX: number, currentY: number): [number, number][]{
        const moves: [number, number][] = [];
        const knightMoves = [
            [2, 1], [2, -1], [-2, 1], [-2, -1],
            [1, 2], [1, -2], [-1, 2], [-1, -2]
        ];
        for (const [dx, dy] of knightMoves) {
            moves.push([currentX + dx, currentY + dy]);
        }
        return moves;
    }
}

export { Knight };
