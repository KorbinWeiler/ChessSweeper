import { describe, it, expect } from 'vitest';
import { ChessPiece } from '../Model/ChessPiece';

// Create a concrete implementation for testing
class TestPiece extends ChessPiece {
  calculateMoves(currentX: number, currentY: number): [number, number][] {
    return [[currentX + 1, currentY + 1]];
  }
}

describe('ChessPiece', () => {
  describe('constructor', () => {
    it('should create a white piece by default', () => {
      const piece = new TestPiece([1, 0]);
      expect(piece.color).toBe('white');
      expect(piece.movePair).toEqual([1, 0]);
    });

    it('should create a black piece when specified', () => {
      const piece = new TestPiece([1, 1], 'black');
      expect(piece.color).toBe('black');
      expect(piece.movePair).toEqual([1, 1]);
    });

    it('should throw error if calculateMoves is not implemented', () => {
      class AbstractPiece extends ChessPiece {}
      expect(() => new AbstractPiece([1, 0])).toThrow('Abstract method not implemented: calculateMoves');
    });
  });

  describe('calculateMoves', () => {
    it('should be implemented by subclasses', () => {
      const piece = new TestPiece([1, 0]);
      const moves = piece.calculateMoves(3, 3);
      expect(moves).toEqual([[4, 4]]);
    });
  });
});
