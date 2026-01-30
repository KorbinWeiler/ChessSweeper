import { describe, it, expect } from 'vitest';
import { Bishop } from '../Model/Pieces/Bishop';

describe('Bishop', () => {
  describe('constructor', () => {
    it('should create a white bishop by default', () => {
      const bishop = new Bishop();
      expect(bishop.color).toBe('white');
      expect(bishop.movePair).toEqual([1, 1]);
    });

    it('should create a black bishop when specified', () => {
      const bishop = new Bishop('black');
      expect(bishop.color).toBe('black');
    });
  });

  describe('calculateMoves', () => {
    it('should move diagonally in all four directions', () => {
      const bishop = new Bishop();
      const moves = bishop.calculateMoves(3, 3);
      
      // 4 diagonal directions, up to 7 squares each
      // From (3,3): 3 squares in some directions, 4 in others
      expect(moves.length).toBe(28);
      
      // Upper-right diagonal
      expect(moves).toContainEqual([4, 4]);
      expect(moves).toContainEqual([5, 5]);
      
      // Upper-left diagonal
      expect(moves).toContainEqual([4, 2]);
      expect(moves).toContainEqual([5, 1]);
      
      // Lower-right diagonal
      expect(moves).toContainEqual([2, 4]);
      expect(moves).toContainEqual([1, 5]);
      
      // Lower-left diagonal
      expect(moves).toContainEqual([2, 2]);
      expect(moves).toContainEqual([1, 1]);
    });

    it('should calculate moves from corner', () => {
      const bishop = new Bishop();
      const moves = bishop.calculateMoves(0, 0);
      
      // From corner, only one diagonal is available
      expect(moves).toContainEqual([1, 1]);
      expect(moves).toContainEqual([7, 7]);
    });

    it('should move same way for both colors', () => {
      const whiteBishop = new Bishop('white');
      const blackBishop = new Bishop('black');
      
      const whiteMoves = whiteBishop.calculateMoves(4, 4);
      const blackMoves = blackBishop.calculateMoves(4, 4);
      
      expect(whiteMoves).toEqual(blackMoves);
    });
  });
});
