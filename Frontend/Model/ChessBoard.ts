import { ChessPiece } from './ChessPiece';
import { ChessTile } from './ChessTile';
import { Bomb } from './Bomb';
import { Pawn } from './Pieces/Pawn';
import { Rook } from './Pieces/Rook';
import { Knight } from './Pieces/Knight';
import { Bishop } from './Pieces/Bishop';
import { Queen } from './Pieces/Queen';
import { King } from './Pieces/King';

export class ChessBoard {
    // Class implementation goes here
    board: ChessTile[][] = [];

    constructor() {
        // Initialization code goes here
        this.InitializationBoardSize();
        this.InitializePieces();
        this.InitializeBombs(8);
    }

    InitializationBoardSize(){
        this.board = [];
        for (let x = 0; x < 8; x++) {
            const row: ChessTile[] = [];
            for (let y = 0; y < 8; y++) {
                row.push(new ChessTile(x, y));
            }
            this.board.push(row);
        }
    }

    InitializePieces(){
        // Place black pieces (row 0 and 1)
        // Row 0: Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook
            this.board[0]![0]!.piece = new Rook('black');
            this.board[0]![1]!.piece = new Knight('black');
            this.board[0]![2]!.piece = new Bishop('black');
            this.board[0]![3]!.piece = new Queen('black');
            this.board[0]![4]!.piece = new King('black');
            this.board[0]![5]!.piece = new Bishop('black');
            this.board[0]![6]!.piece = new Knight('black');
            this.board[0]![7]!.piece = new Rook('black');
        
        // Row 1: Pawns
        for (let x = 0; x < 8; x++) {
              this.board[1]![x]!.piece = new Pawn('black');
        }

        // Place white pieces (row 6 and 7)
        // Row 6: Pawns
        for (let x = 0; x < 8; x++) {
              this.board[6]![x]!.piece = new Pawn('white');
        }
        
        // Row 7: Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook
            this.board[7]![0]!.piece = new Rook('white');
            this.board[7]![1]!.piece = new Knight('white');
            this.board[7]![2]!.piece = new Bishop('white');
            this.board[7]![3]!.piece = new Queen('white');
            this.board[7]![4]!.piece = new King('white');
            this.board[7]![5]!.piece = new Bishop('white');
            this.board[7]![6]!.piece = new Knight('white');
            this.board[7]![7]!.piece = new Rook('white');
    }

    InitializeBombs(numberOfBombs: number){
        const bombList: number[] = [];
        while (bombList.length < numberOfBombs){
            const randomX = Math.floor(Math.random() * 8);
            const randomY = Math.floor(Math.random() * 8);
            const bombPosition = randomX + randomY * 8;
            if (!bombList.includes(bombPosition) && bombPosition < 48 && bombPosition >= 16 && this.board[randomY]![randomX]!.piece === null){
                this.board[randomY]![randomX]!.bomb = new Bomb();
                bombList.push(bombPosition);
            }
        }
    }

    FindBombs(): void {
        this.board.forEach(row => {
            let bombCount = 0;
            row.forEach(tile => {
                for (let dx = -1; dx <= 1; dx++) {
                    for (let dy = -1; dy <= 1; dy++) {
                        if (dx === 0 && dy === 0) continue; // Skip the tile itself
                        const newX = tile.x + dx;
                        const newY = tile.y + dy;
                        if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
                            if (this.board[newY]![newX]!.bomb) {
                                bombCount++;
                            }
                        }
                    }
                }
                tile.vicinityBombs = bombCount;
            });
        });
    }
}