import { ChessPiece } from "../ChessPiece";

class Pawn extends ChessPiece{
    hasMoved: boolean = false;

    constructor(color: 'white' | 'black' = "white"){
        super([1], color);
    }

    override calculateMoves(currentX: number, currentY: number): [number, number][]{
        const moves: [number, number][] = [];
        // Pawns move along the X axis (rows). White moves toward lower row indexes, black toward higher.
        const direction = this.color === 'white' ? -1 : 1;
        // Standard one-square move forward
        moves.push([currentX + direction, currentY]);
        // Diagonal captures (one forward, one sideways) - validity checked by board logic
        moves.push([currentX + direction, currentY + 1]);
        moves.push([currentX + direction, currentY - 1]);
        if (!this.hasMoved){
            // Two-square move on first move
            moves.push([currentX + 2 * direction, currentY]);
        }
        return moves;
    }
}

export { Pawn };