import { ChessPiece } from "../ChessPiece";

class Pawn extends ChessPiece{
    hasMoved: boolean = false;

    constructor(color: 'white' | 'black' = "white"){
        super([1], color);
    }

    calculateMoves(currentX: number, currentY: number): [number, number][]{
        const moves: [number, number][] = [];
        let direction = 1; // Assuming pawns move "up" the board
        if (this.color === "black"){
            direction = -1;
        }
        // Standard one-square move
        moves.push([currentX, currentY + direction]);
        if (!this.hasMoved){
            // Two-square move on first move
            moves.push([currentX, currentY + 2 * direction]);
        }
        return moves;
    }
}

export { Pawn };