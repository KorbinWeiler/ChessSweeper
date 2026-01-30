import { describe, it, expect } from 'vitest';
import { Pawn } from '../Model/Pieces/Pawn';

describe('Pawn', () => {
  describe('constructor', () => {
    it('should create a white pawn by default', () => {
      const pawn = new Pawn();
      expect(pawn.color).toBe('white');
      expect(pawn.hasMoved).toBe(false);
      expect(pawn.movePair).toEqual([1]);
    });

    it('should create a black pawn when specified', () => {
      const pawn = new Pawn('black');
      expect(pawn.color).toBe('black');
      expect(pawn.hasMoved).toBe(false);
    });
  });

  describe('calculateMoves', () => {
    it('should move one square forward for white pawn', () => {
      const pawn = new Pawn('white');
      const moves = pawn.calculateMoves(3, 3);
      expect(moves).toContainEqual([3, 4]);
    });

    it('should move one square backward for black pawn', () => {
      const pawn = new Pawn('black');
      const moves = pawn.calculateMoves(3, 3);
      expect(moves).toContainEqual([3, 2]);
    });

    it('should allow two-square move when not moved yet (white)', () => {
      const pawn = new Pawn('white');
      const moves = pawn.calculateMoves(3, 1);
      expect(moves).toContainEqual([3, 2]);
      expect(moves).toContainEqual([3, 3]);
      expect(moves).toHaveLength(2);
    });

    it('should allow two-square move when not moved yet (black)', () => {
      const pawn = new Pawn('black');
      const moves = pawn.calculateMoves(3, 6);
      expect(moves).toContainEqual([3, 5]);
      expect(moves).toContainEqual([3, 4]);
      expect(moves).toHaveLength(2);
    });

    it('should only allow one-square move after first move', () => {
      const pawn = new Pawn('white');
      pawn.hasMoved = true;
      const moves = pawn.calculateMoves(3, 3);
      expect(moves).toHaveLength(1);
      expect(moves).toContainEqual([3, 4]);
    });
  });
});
