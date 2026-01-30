import { describe, it, expect } from 'vitest';
import { Queen } from '../Model/Pieces/Queen';

describe('Queen', () => {
  describe('constructor', () => {
    it('should create a white queen by default', () => {
      const queen = new Queen();
      expect(queen.color).toBe('white');
      expect(queen.movePair).toEqual([1, 1]);
    });

    it('should create a black queen when specified', () => {
      const queen = new Queen('black');
      expect(queen.color).toBe('black');
    });
  });

  describe('calculateMoves', () => {
    it('should move in all 8 directions (horizontally, vertically, and diagonally)', () => {
      const queen = new Queen();
      const moves = queen.calculateMoves(3, 3);
      
      // 8 directions, up to 7 squares each = 56 total moves
      expect(moves.length).toBe(56);
      
      // Horizontal right
      expect(moves).toContainEqual([3, 4]);
      expect(moves).toContainEqual([3, 7]);
      
      // Horizontal left
      expect(moves).toContainEqual([3, 2]);
      expect(moves).toContainEqual([3, 0]);
      
      // Vertical up
      expect(moves).toContainEqual([4, 3]);
      expect(moves).toContainEqual([7, 3]);
      
      // Vertical down
      expect(moves).toContainEqual([2, 3]);
      expect(moves).toContainEqual([0, 3]);
      
      // Diagonal upper-right
      expect(moves).toContainEqual([4, 4]);
      expect(moves).toContainEqual([7, 7]);
      
      // Diagonal upper-left
      expect(moves).toContainEqual([4, 2]);
      
      // Diagonal lower-right
      expect(moves).toContainEqual([2, 4]);
      
      // Diagonal lower-left
      expect(moves).toContainEqual([2, 2]);
      expect(moves).toContainEqual([0, 0]);
    });

    it('should combine rook and bishop movement patterns', () => {
      const queen = new Queen();
      const moves = queen.calculateMoves(0, 0);
      
      // From corner, can move along edge and one diagonal
      expect(moves).toContainEqual([1, 0]); // Vertical
      expect(moves).toContainEqual([0, 1]); // Horizontal
      expect(moves).toContainEqual([1, 1]); // Diagonal
      expect(moves).toContainEqual([7, 7]); // Diagonal far
    });
  });
});
