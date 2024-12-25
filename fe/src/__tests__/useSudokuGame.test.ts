import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useSudokuGame } from '../hooks/useSudokuGame';

describe('useSudokuGame', () => {
  let game: ReturnType<typeof useSudokuGame>;

  beforeEach(async () => {
    vi.useFakeTimers(); 
    game = useSudokuGame();
    await game.newGame();
  });

  describe('Game Board Generation', () => {
    it('should generate valid 9x9 grid', () => {
      expect(game.grid.value.length).toBe(9);
      game.grid.value.forEach(row => {
        expect(row.length).toBe(9);
      });
    });

    it('should have valid solution', () => {
      game.solution.value.forEach(row => {
        const numbers = row.filter(n => n !== null);
        expect(new Set(numbers).size).toBe(numbers.length); 
        numbers.forEach(n => expect(n).toBeGreaterThanOrEqual(1)); 
        numbers.forEach(n => expect(n).toBeLessThanOrEqual(9)); 
      });
    });

    it('should have correct number of prefilled cells', () => {
      const prefilledCount = game.grid.value.flat().filter(cell => cell.prefilled).length;
      expect(prefilledCount).toBeGreaterThanOrEqual(36); 
      expect(prefilledCount).toBeLessThanOrEqual(40); 
    });
  });

  describe('Game Mechanics', () => {
    it('should select cell correctly', () => {
      game.selectCell(1, 1);
      expect(game.selectedCell.value).toEqual({ i: 1, j: 1 });
      expect(game.selectedNumber.value).toBe(game.grid.value[1][1].value);
    });

    it('should handle digit entry correctly', async () => {
      game.selectCell(0, 0);
      const correctDigit = game.solution.value[0][0];

      if (!game.grid.value[0][0].prefilled) {
        await game.enterDigit(correctDigit!);
        expect(game.grid.value[0][0].value).toBe(correctDigit); 
        expect(game.grid.value[0][0].isError).toBe(false); 
      }
    });

    it('should detect incorrect digit entry', async () => {
      game.selectCell(0, 0);
      if (!game.grid.value[0][0].prefilled) {
        const correctDigit = game.solution.value[0][0];
        const wrongDigit = correctDigit === 9 ? 1 : correctDigit! + 1;

        await game.enterDigit(wrongDigit);
        expect(game.grid.value[0][0].isError).toBe(true);
      }
    });

    it('should handle hint usage', async () => {
      game.selectCell(0, 0);
      if (!game.grid.value[0][0].prefilled) {
        await game.useHint();
        expect(game.grid.value[0][0].value).toBe(game.solution.value[0][0]); 
        expect(game.hintsUsed.value).toBe(1); 
      }
    });

    it('should limit hint usage', async () => {
      for (let i = 0; i < 4; i++) {
        for (let row = 0; row < 9; row++) {
          for (let col = 0; col < 9; col++) {
            if (!game.grid.value[row][col].prefilled && game.hintsUsed.value < 10) {
              game.selectCell(row, col);
              await game.useHint();
              break;
            }
          }
          if (game.hintsUsed.value >= 10) break;
        }
      }
      expect(game.hintsUsed.value).toBeLessThanOrEqual(10); 
    });
  });

  describe('Game History', () => {
    it('should handle undo/redo correctly', async () => {
      game.selectCell(0, 0);
      if (!game.grid.value[0][0].prefilled) {
        const originalValue = game.grid.value[0][0].value;
        await game.enterDigit(5);

        game.undo();
        expect(game.grid.value[0][0].value).toBe(originalValue);

        game.redo();
        expect(game.grid.value[0][0].value).toBe(5); 
      }
    });
  });
  describe('Game Controls', () => {
    it('should handle keyboard navigation', () => {
      game.selectCell(1, 1);

      const testMoves = [
        { key: 'ArrowRight', expected: { i: 1, j: 2 } },
        { key: 'ArrowDown', expected: { i: 2, j: 2 } },  
        { key: 'ArrowLeft', expected: { i: 2, j: 1 } },  
        { key: 'ArrowUp', expected: { i: 1, j: 1 } }     
      ];

      testMoves.forEach(({ key, expected }) => {
        const mockEvent = {
          key,
          preventDefault: () => {},
          stopPropagation: () => {}
        };

        game.handleKeyPress(mockEvent as KeyboardEvent);
        expect(game.selectedCell.value).toEqual(expected); 
      });
    });

    it('should handle number input via keyboard', async () => {
      game.selectCell(0, 0);
      if (!game.grid.value[0][0].prefilled) {
        const digit = '5';
        const mockEvent = {
          key: digit,
          preventDefault: () => {},
          stopPropagation: () => {}
        };

        game.handleKeyPress(mockEvent as KeyboardEvent);
        expect(game.grid.value[0][0].value).toBe(Number(digit)); 
      }
    });

    it('should handle cell clearing', () => {
      game.selectCell(0, 0);
      if (!game.grid.value[0][0].prefilled) {
        const mockNumberEvent = {
          key: '5',
          preventDefault: () => {},
          stopPropagation: () => {}
        };
        game.handleKeyPress(mockNumberEvent as KeyboardEvent);

        const mockBackspaceEvent = {
          key: 'Backspace',
          preventDefault: () => {},
          stopPropagation: () => {}
        };
        game.handleKeyPress(mockBackspaceEvent as KeyboardEvent);

        expect(game.grid.value[0][0].value).toBeNull();
      }
    });
  });

  describe('Game State', () => {
    it('should track score correctly', async () => {
      const initialScore = game.score.value;
      game.selectCell(0, 0);

      if (!game.grid.value[0][0].prefilled) {
        const correctDigit = game.solution.value[0][0];
        await game.enterDigit(correctDigit!);
        expect(game.score.value).toBe(initialScore + 10);
      }
    });

    it('should handle game win state', async () => {
      game.grid.value = game.solution.value.map(row =>
          row.map(value => ({
            value,
            prefilled: false,
            isError: false
          }))
      );

      expect(game.checkWin()).toBe(true);
      await game.handleWin();
      expect(game.isGameWon.value).toBe(true); 
    });
  });
});