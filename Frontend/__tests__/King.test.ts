import { describe, it, expect } from 'vitest';
import { King } from '../Model/Pieces/King';

describe('King', () => {
  describe('constructor', () => {
    it('should create a white king by default', () => {
      const king = new King();
      expect(king.color).toBe('white');
      expect(king.movePair).toEqual([1, 1]);
    });

    it('should create a black king when specified', () => {
      const king = new King('black');
      expect(king.color).toBe('black');
    });
  });

  describe('calculateMoves', () => {
    it('should move one square in all 8 directions', () => {
      const king = new King();
      const moves = king.calculateMoves(3, 3);
      
      // King can move 1 square in 8 directions
      expect(moves).toHaveLength(8);
      
      // All 8 adjacent squares
      expect(moves).toContainEqual([4, 3]);   // Up
      expect(moves).toContainEqual([2, 3]);   // Down
      expect(moves).toContainEqual([3, 4]);   // Right
      expect(moves).toContainEqual([3, 2]);   // Left
      expect(moves).toContainEqual([4, 4]);   // Upper-right
      expect(moves).toContainEqual([4, 2]);   // Upper-left
      expect(moves).toContainEqual([2, 4]);   // Lower-right
      expect(moves).toContainEqual([2, 2]);   // Lower-left
    });

    it('should calculate moves from corner', () => {
      const king = new King();
      const moves = king.calculateMoves(0, 0);
      
      // From corner, still generates 8 moves (some off-board)
      expect(moves).toHaveLength(8);
      expect(moves).toContainEqual([1, 0]);
      expect(moves).toContainEqual([0, 1]);
      expect(moves).toContainEqual([1, 1]);
    });

    it('should only move one square unlike queen', () => {
      const king = new King();
      const moves = king.calculateMoves(3, 3);
      
      // Should NOT contain moves more than 1 square away
      expect(moves).not.toContainEqual([5, 3]);
      expect(moves).not.toContainEqual([3, 5]);
      expect(moves).not.toContainEqual([5, 5]);
    });
  });
});
