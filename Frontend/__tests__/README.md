# ChessSweeper Tests

This directory contains comprehensive test suites for the ChessSweeper frontend models using Vitest.

## Test Coverage

### Model Tests
- **Bomb.test.ts** - Tests for bomb creation, activation, and detonation
- **ChessPiece.test.ts** - Tests for the abstract ChessPiece base class
- **ChessTile.test.ts** - Tests for tile creation and piece/bomb placement
- **ChessBoard.test.ts** - Tests for board initialization and piece placement

### Chess Piece Tests
- **Pawn.test.ts** - Tests for pawn movement (single/double move, direction)
- **Rook.test.ts** - Tests for rook movement (horizontal/vertical)
- **Knight.test.ts** - Tests for knight L-shaped movement
- **Bishop.test.ts** - Tests for bishop diagonal movement
- **Queen.test.ts** - Tests for queen movement (all 8 directions)
- **King.test.ts** - Tests for king movement (one square in all directions)

## Running Tests

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Test Results

✅ 10 test files
✅ 53 test cases passed
✅ All models validated

## Test Framework

- **Vitest** - Fast unit test framework for Vite projects
- **happy-dom** - Lightweight DOM implementation for testing
- **@vitest/ui** - Visual UI for test results
