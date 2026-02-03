import { ChessPiece } from './ChessPiece';
import { Bomb } from './Bomb';

class ChessTile{
    x: number;
    y: number;
    piece: ChessPiece | null;
    bomb: Bomb | null;
    vicinityBombs: number = 0;

    constructor(x: number, y: number, piece: ChessPiece | null = null, bomb: Bomb | null = null){
        this.x = x;
        this.y = y;
        this.piece = piece;
        this.bomb = bomb;
    }
}

export { ChessTile };