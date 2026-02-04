import { ChessPiece } from "../ChessPiece";

class King extends ChessPiece{
    constructor(color: 'white' | 'black' = "white"){
        super([1, 1], color);
    }
    override calculateMoves(currentX: number, currentY: number): [number, number][]{
        const moves: [number, number][] = [];
        const directions = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
        for (const [dx, dy] of directions) {
            const newX = currentX + dx!;
            const newY = currentY + dy!;
            moves.push([newX, newY]);
        }
        return moves;
    }
}
export { King };