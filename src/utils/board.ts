export type Direction = "left" | "right" | "up" | "down";
export const BOARD_SIZE = 4;

export function addRandomTile(currentBoard: number[][]): number[][] {
  const newBoard = currentBoard.map(row => [...row]);
  const emptyCells: { row: number; col: number }[] = [];

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (newBoard[row][col] === 0) emptyCells.push({ row, col });
    }
  }

  if (emptyCells.length === 0) return newBoard;

  const position = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  newBoard[position.row][position.col] = Math.random() < 0.9 ? 2 : 4;
  return newBoard;
}

export function createBoard(): number[][] {
  const emptyBoard = Array.from({ length: BOARD_SIZE }, () => [0, 0, 0, 0]);
  return addRandomTile(addRandomTile(emptyBoard));
}

export function moveLineLeft(line: number[]) {
  const numbers = line.filter(value => value !== 0);
  const result: number[] = [];
  let points = 0;

  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] === numbers[i + 1]) {
      const merged = numbers[i] * 2;
      result.push(merged);
      points += merged;
      i++;
    } else {
      result.push(numbers[i]);
    }
  }

  while (result.length < BOARD_SIZE) result.push(0);
  return { line: result, points };
}

export function moveBoard(currentBoard: number[][], direction: Direction) {
  const newBoard = currentBoard.map(row => [...row]);
  const horizontal = direction === "left" || direction === "right";
  const reverse = direction === "right" || direction === "down";
  let points = 0;

  for (let index = 0; index < BOARD_SIZE; index++) {
    const line = horizontal
      ? [...currentBoard[index]]
      : currentBoard.map(row => row[index]);
    if (reverse) line.reverse();

    const result = moveLineLeft(line);
    points += result.points;
    if (reverse) result.line.reverse();

    for (let cell = 0; cell < BOARD_SIZE; cell++) {
      if (horizontal) newBoard[index][cell] = result.line[cell];
      else newBoard[cell][index] = result.line[cell];
    }
  }

  return {
    board: newBoard,
    points,
    changed: JSON.stringify(newBoard) !== JSON.stringify(currentBoard),
  };
}

export function isGameOver(board: number[][]): boolean {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const value = board[row][col];
      if (value === 0) return false;
      if (col < BOARD_SIZE - 1 && value === board[row][col + 1]) return false;
      if (row < BOARD_SIZE - 1 && value === board[row + 1][col]) return false;
    }
  }
  return true;
}

export function getSwipeDirection(dx: number, dy: number): Direction | null {
  if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return null;
  if (Math.abs(dx) > Math.abs(dy)) return dx < 0 ? "left" : "right";
  return dy < 0 ? "up" : "down";
}
