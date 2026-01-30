import { describe, it, expect, beforeEach } from 'vitest';
import { ChessBoard } from '../Model/ChessBoard';
import { Pawn } from '../Model/Pieces/Pawn';
import { Rook } from '../Model/Pieces/Rook';
import { Knight } from '../Model/Pieces/Knight';
import { Bishop } from '../Model/Pieces/Bishop';
import { Queen } from '../Model/Pieces/Queen';
import { King } from '../Model/Pieces/King';

describe('ChessBoard', () => {
  let board: ChessBoard;

  beforeEach(() => {
    board = new ChessBoard();
  });

  describe('constructor', () => {
    it('should initialize an 8x8 board', () => {
      expect(board.board).toHaveLength(8);
      board.board.forEach((row: ChessTile[]) => {
        expect(row).toHaveLength(8);
      });
    });

    it('should initialize all tiles with correct coordinates', () => {
      for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
          expect(board.board[x][y].x).toBe(x);
          expect(board.board[x][y].y).toBe(y);
        }
      }
    });

    it('should call InitializePieces during construction', () => {
      // Check that pieces are placed
      expect(board.board[0][0].piece).toBeDefined();
      expect(board.board[7][0].piece).toBeDefined();
    });
  });

  describe('InitializationBoardSize', () => {
    it('should create an empty 8x8 board', () => {
      const emptyBoard = new ChessBoard();
      // Since constructor calls InitializePieces, we check structure only
      expect(emptyBoard.board).toHaveLength(8);
      expect(emptyBoard.board[0]).toHaveLength(8);
    });
  });

  describe('InitializePieces', () => {
    describe('Black pieces (rows 0-1)', () => {
      it('should place black back rank pieces correctly', () => {
        expect(board.board[0][0].piece).toBeInstanceOf(Rook);
        expect(board.board[0][0].piece?.color).toBe('black');
        
        expect(board.board[0][1].piece).toBeInstanceOf(Knight);
        expect(board.board[0][1].piece?.color).toBe('black');
        
        expect(board.board[0][2].piece).toBeInstanceOf(Bishop);
        expect(board.board[0][2].piece?.color).toBe('black');
        
        expect(board.board[0][3].piece).toBeInstanceOf(Queen);
        expect(board.board[0][3].piece?.color).toBe('black');
        
        expect(board.board[0][4].piece).toBeInstanceOf(King);
        expect(board.board[0][4].piece?.color).toBe('black');
        
        expect(board.board[0][5].piece).toBeInstanceOf(Bishop);
        expect(board.board[0][5].piece?.color).toBe('black');
        
        expect(board.board[0][6].piece).toBeInstanceOf(Knight);
        expect(board.board[0][6].piece?.color).toBe('black');
        
        expect(board.board[0][7].piece).toBeInstanceOf(Rook);
        expect(board.board[0][7].piece?.color).toBe('black');
      });

      it('should place all black pawns on row 1', () => {
        for (let x = 0; x < 8; x++) {
          expect(board.board[1][x].piece).toBeInstanceOf(Pawn);
          expect(board.board[1][x].piece?.color).toBe('black');
        }
      });
    });

    describe('White pieces (rows 6-7)', () => {
      it('should place white back rank pieces correctly', () => {
        expect(board.board[7][0].piece).toBeInstanceOf(Rook);
        expect(board.board[7][0].piece?.color).toBe('white');
        
        expect(board.board[7][1].piece).toBeInstanceOf(Knight);
        expect(board.board[7][1].piece?.color).toBe('white');
        
        expect(board.board[7][2].piece).toBeInstanceOf(Bishop);
        expect(board.board[7][2].piece?.color).toBe('white');
        
        expect(board.board[7][3].piece).toBeInstanceOf(Queen);
        expect(board.board[7][3].piece?.color).toBe('white');
        
        expect(board.board[7][4].piece).toBeInstanceOf(King);
        expect(board.board[7][4].piece?.color).toBe('white');
        
        expect(board.board[7][5].piece).toBeInstanceOf(Bishop);
        expect(board.board[7][5].piece?.color).toBe('white');
        
        expect(board.board[7][6].piece).toBeInstanceOf(Knight);
        expect(board.board[7][6].piece?.color).toBe('white');
        
        expect(board.board[7][7].piece).toBeInstanceOf(Rook);
        expect(board.board[7][7].piece?.color).toBe('white');
      });

      it('should place all white pawns on row 6', () => {
        for (let x = 0; x < 8; x++) {
          expect(board.board[6][x].piece).toBeInstanceOf(Pawn);
          expect(board.board[6][x].piece?.color).toBe('white');
        }
      });
    });

    describe('Middle rows', () => {
      it('should have empty tiles in rows 2-5', () => {
        for (let x = 2; x <= 5; x++) {
          for (let y = 0; y < 8; y++) {
            expect(board.board[x][y].piece).toBeNull();
          }
        }
      });
    });

    it('should have exactly 16 pieces per color', () => {
      let whiteCount = 0;
      let blackCount = 0;
      
      for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
          const piece = board.board[x][y].piece;
          if (piece?.color === 'white') whiteCount++;
          if (piece?.color === 'black') blackCount++;
        }
      }
      
      expect(whiteCount).toBe(16);
      expect(blackCount).toBe(16);
    });

    it('does not place bombs on tiles intended for initial pieces', () => {
      const rowsWithPieces = [0, 1, 6, 7];
      for (const x of rowsWithPieces) {
        for (let y = 0; y < 8; y++) {
          const tile = board.board[x][y];
          if (tile.piece) {
            expect(tile.bomb).toBeNull();
          }
        }
      }
    });
  });
});
