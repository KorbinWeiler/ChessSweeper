import { describe, it, expect } from 'vitest';
import { Rook } from '../Model/Pieces/Rook';

describe('Rook', () => {
  describe('constructor', () => {
    it('should create a white rook by default', () => {
      const rook = new Rook();
      expect(rook.color).toBe('white');
      expect(rook.hasMoved).toBe(false);
      expect(rook.movePair).toEqual([1, 0]);
    });

    it('should create a black rook when specified', () => {
      const rook = new Rook('black');
      expect(rook.color).toBe('black');
      expect(rook.hasMoved).toBe(false);
    });
  });

  describe('calculateMoves', () => {
    it('should move in all four cardinal directions', () => {
      const rook = new Rook();
      const moves = rook.calculateMoves(3, 3);
      
      // Should have moves in 4 directions, 7 squares each = 28 total
      expect(moves.length).toBe(28);
      
      // Check upward moves
      expect(moves).toContainEqual([4, 3]);
      expect(moves).toContainEqual([5, 3]);
      expect(moves).toContainEqual([7, 3]);
      
      // Check downward moves
      expect(moves).toContainEqual([2, 3]);
      expect(moves).toContainEqual([1, 3]);
      expect(moves).toContainEqual([0, 3]);
      
      // Check right moves
      expect(moves).toContainEqual([3, 4]);
      expect(moves).toContainEqual([3, 7]);
      
      // Check left moves
      expect(moves).toContainEqual([3, 2]);
      expect(moves).toContainEqual([3, 0]);
    });

    it('should include all positions in straight lines', () => {
      const rook = new Rook();
      const moves = rook.calculateMoves(0, 0);
      
      // From corner, should move along two directions
      expect(moves).toContainEqual([1, 0]);
      expect(moves).toContainEqual([7, 0]);
      expect(moves).toContainEqual([0, 1]);
      expect(moves).toContainEqual([0, 7]);
    });
  });
});
