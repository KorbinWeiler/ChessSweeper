import { describe, it, expect } from 'vitest';
import { Bomb } from '../Model/Bomb';

describe('Bomb', () => {
  describe('constructor', () => {
    it('should create an active bomb by default', () => {
      const bomb = new Bomb();
      expect(bomb.isActive).toBe(true);
    });

    it('should create an inactive bomb when specified', () => {
      const bomb = new Bomb(false);
      expect(bomb.isActive).toBe(false);
    });
  });

  describe('detonate', () => {
    it('should deactivate an active bomb and return true', () => {
      const bomb = new Bomb();
      const result = bomb.detonate();
      expect(result).toBe(true);
      expect(bomb.isActive).toBe(false);
    });

    it('should return false when detonating an already inactive bomb', () => {
      const bomb = new Bomb(false);
      const result = bomb.detonate();
      expect(result).toBe(false);
      expect(bomb.isActive).toBe(false);
    });

    it('should only allow one detonation', () => {
      const bomb = new Bomb();
      bomb.detonate();
      const secondDetonation = bomb.detonate();
      expect(secondDetonation).toBe(false);
    });
  });
});
