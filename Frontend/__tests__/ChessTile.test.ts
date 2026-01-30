import { describe, it, expect } from 'vitest';
import { ChessTile } from '../Model/ChessTile';
import { Bomb } from '../Model/Bomb';
import { Pawn } from '../Model/Pieces/Pawn';

describe('ChessTile', () => {
  describe('constructor', () => {
    it('should create a tile with coordinates', () => {
      const tile = new ChessTile(3, 4);
      expect(tile.x).toBe(3);
      expect(tile.y).toBe(4);
      expect(tile.piece).toBeNull();
      expect(tile.bomb).toBeNull();
    });

    it('should create a tile with a piece', () => {
      const pawn = new Pawn('white');
      const tile = new ChessTile(2, 3, pawn);
      expect(tile.x).toBe(2);
      expect(tile.y).toBe(3);
      expect(tile.piece).toBe(pawn);
      expect(tile.bomb).toBeNull();
    });

    it('should create a tile with a bomb', () => {
      const bomb = new Bomb();
      const tile = new ChessTile(5, 6, null, bomb);
      expect(tile.x).toBe(5);
      expect(tile.y).toBe(6);
      expect(tile.piece).toBeNull();
      expect(tile.bomb).toBe(bomb);
    });

    it('should create a tile with both piece and bomb', () => {
      const pawn = new Pawn('black');
      const bomb = new Bomb();
      const tile = new ChessTile(1, 2, pawn, bomb);
      expect(tile.x).toBe(1);
      expect(tile.y).toBe(2);
      expect(tile.piece).toBe(pawn);
      expect(tile.bomb).toBe(bomb);
    });
  });
});
