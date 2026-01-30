import { ChessPiece } from "../ChessPiece";

class Rook extends ChessPiece {
    hasMoved: boolean = false;

    constructor(color: 'white' | 'black' = "white"){
        super([1, 0], color);
    }
    calculateMoves(currentX: number, currentY: number): [number, number][]{
        const moves: [number, number][] = [];
        const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        for (const [dx, dy] of directions) {
            for (let step = 1; step < 8; step++) {
                const newX = currentX + dx * step;
                const newY = currentY + dy * step;
                moves.push([newX, newY]);
            }
        }

        return moves;
    }
}

export { Rook };