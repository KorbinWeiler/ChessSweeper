import { describe, it, expect } from 'vitest';
import { Knight } from '../Model/Pieces/Knight';

describe('Knight', () => {
  describe('constructor', () => {
    it('should create a white knight by default', () => {
      const knight = new Knight();
      expect(knight.color).toBe('white');
      expect(knight.movePair).toEqual([2, 1]);
    });

    it('should create a black knight when specified', () => {
      const knight = new Knight('black');
      expect(knight.color).toBe('black');
    });
  });

  describe('calculateMoves', () => {
    it('should have 8 possible L-shaped moves from center', () => {
      const knight = new Knight();
      const moves = knight.calculateMoves(4, 4);
      
      expect(moves).toHaveLength(8);
      
      // All 8 L-shaped moves
      expect(moves).toContainEqual([6, 5]);  // 2 right, 1 up
      expect(moves).toContainEqual([6, 3]);  // 2 right, 1 down
      expect(moves).toContainEqual([2, 5]);  // 2 left, 1 up
      expect(moves).toContainEqual([2, 3]);  // 2 left, 1 down
      expect(moves).toContainEqual([5, 6]);  // 1 right, 2 up
      expect(moves).toContainEqual([5, 2]);  // 1 right, 2 down
      expect(moves).toContainEqual([3, 6]);  // 1 left, 2 up
      expect(moves).toContainEqual([3, 2]);  // 1 left, 2 down
    });

    it('should calculate moves from corner position', () => {
      const knight = new Knight();
      const moves = knight.calculateMoves(0, 0);
      
      // From corner, knight can move to 2 positions
      expect(moves).toHaveLength(8); // Still generates 8, but some may be off-board
      expect(moves).toContainEqual([2, 1]);
      expect(moves).toContainEqual([1, 2]);
    });

    it('should calculate moves correctly regardless of color', () => {
      const whiteKnight = new Knight('white');
      const blackKnight = new Knight('black');
      
      const whiteMoves = whiteKnight.calculateMoves(3, 3);
      const blackMoves = blackKnight.calculateMoves(3, 3);
      
      expect(whiteMoves).toEqual(blackMoves);
    });
  });
});
