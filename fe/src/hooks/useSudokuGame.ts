import {ref, computed, type Ref} from 'vue';
import type {
    Cell,
    Position,
    LeaderboardEntry,
    DifficultyLevel,
    GameState,
    GameHistory
} from '../interfaces/sudoku';
import {DEFAULT_HINT_COUNT} from '../consts/defaultHintCount';
import {getLeaderboard, saveGameScore} from '../service/leaderbordService';
import type {TimerId} from "../interfaces/timer.ts";


export function useSudokuGame() {
    const isGameWon: Ref<boolean> = ref(false);
    const grid: Ref<Cell[][]> = ref([]);
    const solution: Ref<(number | null)[][]> = ref([]);
    const selectedCell: Ref<Position | null> = ref(null);
    const selectedNumber: Ref<number | null> = ref(null);
    const score: Ref<number> = ref(0);
    const hintsUsed: Ref<number> = ref(0);
    const rank: Ref<DifficultyLevel> = ref('beginner');
    const startTime: Ref<number> = ref(0);
    const elapsedTime: Ref<number> = ref(0);
    const timer: Ref<TimerId | null> = ref(null);
    const leaderboard: Ref<LeaderboardEntry[]> = ref([]);
    const formattedTime = computed(() => formatTime(elapsedTime.value));
    const canUndo = computed(() => !isGameWon.value && history.value.past.length > 0);
    const canRedo = computed(() => !isGameWon.value && history.value.future.length > 0);
    const history: Ref<GameHistory> = ref({
        past: [],
        future: []
    });
    const cellsToShow: Record<DifficultyLevel, number> = {
        beginner: 36,
        intermediate: 32,
        hard: 28,
        expert: 24
    };
    function generateGame(): void {
        const baseCount = cellsToShow[rank.value];
        const randomOffset = Math.floor(Math.random() * 5);

        grid.value = Array(9).fill(null).map(() =>
            Array(9).fill(null).map(() => ({
                value: null,
                prefilled: false,
                isError: false
            }))
        );

        solution.value = generateSolution();
        showCells(baseCount + randomOffset);
    }

    function generateSolution(): (number | null)[][] {
        const newSolution: (number | null)[][] = Array(9).fill(null).map(() => Array(9).fill(null));
        fillDiagonal(newSolution);
        solveSudoku(newSolution);
        return newSolution;
    }

    function fillDiagonal(grid: (number | null)[][]): void {
        for (let i = 0; i < 9; i += 3) {
            fillBox(grid, i, i);
        }
    }

    function fillBox(grid: (number | null)[][], startRow: number, startCol: number): void {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const randomIndex = Math.floor(Math.random() * numbers.length);
                grid[startRow + i][startCol + j] = numbers.splice(randomIndex, 1)[0];
            }
        }
    }

    function solveSudoku(grid: (number | null)[][]): boolean {
        const emptyCell = findEmptyCell(grid);

        if (!emptyCell) return true;

        const [row, col] = emptyCell;

        for (let num = 1; num <= 9; num++) {
            if (isSafe(grid, row, col, num)) {
                grid[row][col] = num;

                if (solveSudoku(grid)) return true;

                grid[row][col] = null;
            }
        }

        return false;
    }

    function findEmptyCell(grid: (number | null)[][]): [number, number] | null {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (grid[i][j] === null) return [i, j];
            }
        }
        return null;
    }

    function isSafe(grid: (number | null)[][], row: number, col: number, num: number): boolean {
        return !usedInRow(grid, row, num) &&       
            !usedInCol(grid, col, num) &&       
            !usedInBox(grid, row - row % 3, col - col % 3, num); 
    }

    function usedInRow(grid: (number | null)[][], row: number, num: number): boolean {
        return grid[row].includes(num);
    }

    function usedInCol(grid: (number | null)[][], col: number, num: number): boolean {
        return grid.some(row => row[col] === num);
    }

    function usedInBox(grid: (number | null)[][], startRow: number, startCol: number, num: number): boolean {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (grid[startRow + i][startCol + j] === num) return true;
            }
        }
        return false;
    }

    function showCells(count: number): void {
        const cells: Position[] = [];
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                cells.push({i, j});
            }
        }

        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * cells.length);
            const {i, j} = cells.splice(randomIndex, 1)[0];
            grid.value[i][j] = {
                value: solution.value[i][j],
                prefilled: true,
                isError: false
            };
        }
    }

    function saveState(): void {
        const currentState: GameState = {
            grid: JSON.parse(JSON.stringify(grid.value)),
            score: score.value,
            hintsUsed: hintsUsed.value
        };

        history.value.past.push(currentState);
        history.value.future = []; 
    }

    function undo(): void {
        if (!canUndo.value) return;

        const currentState: GameState = {
            grid: JSON.parse(JSON.stringify(grid.value)),
            score: score.value,
            hintsUsed: hintsUsed.value
        };


        const previousState = history.value.past.pop()!;
 
        history.value.future.push(currentState);

        grid.value = previousState.grid;
        score.value = previousState.score;
        hintsUsed.value = previousState.hintsUsed;
    }

    function redo(): void {
        if (!canRedo.value) return;


        const currentState: GameState = {
            grid: JSON.parse(JSON.stringify(grid.value)),
            score: score.value,
            hintsUsed: hintsUsed.value
        };

        const nextState = history.value.future.pop()!;
        history.value.past.push(currentState);

        grid.value = nextState.grid;
        score.value = nextState.score;
        hintsUsed.value = nextState.hintsUsed;
    }

    function handleKeyPress(event: KeyboardEvent): void {
        if (isGameWon.value || !selectedCell.value) return;


        const {i, j} = selectedCell.value;

        if (event.key >= '1' && event.key <= '9') {
            const digit = parseInt(event.key);
            if (isDigitAvailable(digit)) {
                enterDigit(digit);
            }
        } else if (event.key === 'Backspace' || event.key === 'Delete') {
            if (!grid.value[i][j].prefilled) {
                clearCell();
            }
        } else if (event.key.startsWith('Arrow')) {
            moveSelection(event.key.slice(5).toLowerCase() as 'up' | 'down' | 'left' | 'right');
        }
    }

    function moveSelection(direction: 'up' | 'down' | 'left' | 'right'): void {
        if (!selectedCell.value) return;

        const {i, j} = selectedCell.value;
        let newI = i;
        let newJ = j;

        switch (direction) {
            case 'up':
                newI = (i - 1 + 9) % 9;
                break;
            case 'down':
                newI = (i + 1) % 9;
                break;
            case 'left':
                newJ = (j - 1 + 9) % 9;
                break;
            case 'right':
                newJ = (j + 1) % 9;
                break;
        }

        selectCell(newI, newJ);
    }

   async function enterDigit(digit: number): Promise<void> {
        if (isGameWon.value || !selectedCell.value || !isDigitAvailable(digit)) return;

        const {i, j} = selectedCell.value;
        const isValid = solution.value[i][j] === digit;

        saveState(); 

        grid.value[i][j] = {
            ...grid.value[i][j],
            value: digit,
            isError: !isValid
        };

        if (isValid) {
            score.value += 10;
            if (checkWin()) {
               await handleWin();
            }
        } else {
            score.value = Math.max(0, score.value - 2);
        }

        selectedNumber.value = digit;
    }

    function clearCell(): void {
        if (isGameWon.value || !selectedCell.value) return;
        const {i, j} = selectedCell.value;

        if (!grid.value[i][j].prefilled) {
            saveState();
            grid.value[i][j] = {
                value: null,
                prefilled: false,
                isError: false
            };
        }
    }

    function selectCell(i: number, j: number): void {
        selectedCell.value = {i, j};
        selectedNumber.value = grid.value[i][j].value;
    }

   async function useHint(): Promise<void> {
       if (isGameWon.value || hintsUsed.value >= DEFAULT_HINT_COUNT || !selectedCell.value) return;


        const {i, j} = selectedCell.value;

        if (grid.value[i][j].prefilled || grid.value[i][j].value === solution.value[i][j]) return;

        saveState();

        grid.value[i][j] = {
            value: solution.value[i][j],
            prefilled: false,
            isError: false
        };

        hintsUsed.value++;
        score.value = Math.max(0, score.value - (3 + hintsUsed.value));
        if (checkWin()) {
            await handleWin();
        }
    }

    function isDigitAvailable(digit: number): boolean {

        return grid.value.flat().filter(cell => cell.value === digit).length < 9;
    }

    function formatTime(seconds: number): string {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    function checkWin(): boolean {

        const allFilled = grid.value.every(row =>
            row.every(cell => cell.value !== null)
        );
        const allCorrect = grid.value.every((row, i) =>
            row.every((cell, j) => cell.value === solution.value[i][j])
        );

        return allFilled && allCorrect;
    }

   async function handleWin(): Promise<void> {
        if (timer.value) {
            clearInterval(timer.value);
        }
        const timeBonus = Math.max(0, 500 - elapsedTime.value);
        score.value += timeBonus;
        history.value = { past: [], future: [] };
        isGameWon.value = true;
        await  saveScore();
    }

   async function saveScore(): Promise<void> {
        const newScore: Omit<LeaderboardEntry, 'timestamp'> = {
            playerName: `Guest player ${Math.random().toString(36).substring(2, 15)}`,
            score: score.value,
            gameTime: elapsedTime.value,
            rank: rank.value,
        };

        const {error} = await saveGameScore(newScore);
        if (error) {
            console.error('Error saving score:', error);
            return;
        }

        await loadLeaderboard()
    }

    function startTimer(): void {
        if (timer.value) {
            clearInterval(timer.value);
        }
        startTime.value = Date.now();
        timer.value = setInterval(() => {
            elapsedTime.value = Math.floor((Date.now() - startTime.value) / 1000);
        }, 1000);
    }

   async function newGame(): Promise<void> {
       isGameWon.value = false;
       history.value = {past: [], future: []};
        generateGame();
        score.value = 0;
        hintsUsed.value = 0;
        selectedCell.value = null;
        selectedNumber.value = null;
        startTimer();
       await loadLeaderboard();
    }


    async function loadLeaderboard(): Promise<void> {
        const {data, error} = await getLeaderboard()
        if (error) {
            console.error('Error');
            leaderboard.value = []
            return;
        }

        leaderboard.value = (data || []).map((item) => {
            return {
                score: item.score,
                timestamp: item.timestamp,
                gameTime: item.gameTime,
                playerName: item.playerName,
                rank: item.rank,
            }
        });
    }

    function cleanup(): void {
        if (timer.value) {
            clearInterval(timer.value);
        }
    }

    async function initialize(): Promise<void> {
        await loadLeaderboard()
        await newGame();
    }

    return {
        grid,
        rank,
        score,
        hintsUsed,
        elapsedTime,
        selectedCell,
        selectedNumber,
        leaderboard,
        formattedTime,
        canUndo,
        canRedo,
        handleKeyPress,
        newGame,
        useHint,
        enterDigit,
        selectCell,
        isDigitAvailable,
        clearCell,
        undo,
        redo,
        cleanup,
        saveScore,
        handleWin,
        loadLeaderboard,
        checkWin,
        initialize,
        isGameWon,
        solution
    };
}