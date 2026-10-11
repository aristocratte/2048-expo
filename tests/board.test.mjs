import test from 'node:test';
import assert from 'node:assert/strict';
import { addRandomTile, createBoard, getSwipeDirection, isGameOver, moveBoard, moveLineLeft } from '../src/utils/board.ts';

const empty = () => Array.from({ length: 4 }, () => [0, 0, 0, 0]);
const sum = board => board.flat().reduce((total, value) => total + value, 0);

test('dos fichas iniciales, sin compartir las filas', () => {
  const board = createBoard();
  assert.equal(board.flat().filter(Boolean).length, 2);
  assert.ok(board.flat().every(value => [0, 2, 4].includes(value)));
  assert.notEqual(board[0], board[1]);
});

for (const [input, expected, points] of [
  [[0, 0, 0, 0], [0, 0, 0, 0], 0],
  [[0, 2, 0, 4], [2, 4, 0, 0], 0],
  [[2, 2, 0, 0], [4, 0, 0, 0], 4],
  [[2, 2, 2, 2], [4, 4, 0, 0], 8],
  [[2, 2, 4, 0], [4, 4, 0, 0], 4],
  [[4, 4, 8, 8], [8, 16, 0, 0], 24],
  [[2, 0, 2, 2], [4, 2, 0, 0], 4],
  [[2, 4, 8, 16], [2, 4, 8, 16], 0],
  [[1024, 1024, 0, 0], [2048, 0, 0, 0], 2048],
]) {
  test(`fusionar ${input} produce ${expected}, +${points}`, () => {
    const before = [...input];
    assert.deepEqual(moveLineLeft(input), { line: expected, points });
    assert.deepEqual(input, before);
  });
}

test('las cuatro direcciones, puntuación y conservación del tablero original', () => {
  const board = [[2, 0, 0, 2], [0, 0, 0, 0], [0, 0, 0, 0], [2, 0, 0, 2]];
  const before = structuredClone(board);
  const cases = {
    left: [[4, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [4, 0, 0, 0]],
    right: [[0, 0, 0, 4], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 4]],
    up: [[4, 0, 0, 4], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
    down: [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [4, 0, 0, 4]],
  };
  for (const [direction, expected] of Object.entries(cases)) {
    assert.deepEqual(moveBoard(board, direction), { board: expected, points: 8, changed: true });
    assert.deepEqual(board, before);
  }
});

test('mover sin fusión da cero puntos; movimiento bloqueado no cambia el tablero', () => {
  const board = empty();
  board[0][0] = 2;
  assert.equal(moveBoard(board, 'left').changed, false);
  assert.equal(moveBoard(board, 'left').points, 0);
  const moved = moveBoard(board, 'right');
  assert.equal(moved.changed, true);
  assert.equal(moved.points, 0);
  assert.equal(moved.board[0][3], 2);
  assert.equal(sum(moved.board), 2);
});

test('añadir exactamente una ficha 2 o 4, sin modificar las otras', () => {
  const board = empty();
  board[0][0] = 16;
  for (let i = 0; i < 50; i++) {
    const next = addRandomTile(board);
    assert.equal(next.flat().filter(Boolean).length, 2);
    assert.equal(next[0][0], 16);
    assert.ok([2, 4].includes(sum(next) - sum(board)));
    assert.equal(board.flat().filter(Boolean).length, 1);
  }
});

test('tablero lleno: sin vecinos iguales termina, con parejas sigue', () => {
  const board = [[2, 4, 2, 4], [4, 2, 4, 2], [2, 4, 2, 4], [4, 2, 4, 2]];
  assert.equal(isGameOver(board), true);
  assert.deepEqual(addRandomTile(board), board);
  const horizontal = structuredClone(board);
  horizontal[3][2] = 2;
  assert.equal(isGameOver(horizontal), false);
  const vertical = structuredClone(board);
  vertical[3][3] = 4;
  assert.equal(isGameOver(vertical), false);
  const space = structuredClone(board);
  space[0][0] = 0;
  assert.equal(isGameOver(space), false);
});

test('el gesto usa el eje dominante e ignora los toques cortos', () => {
  assert.equal(getSwipeDirection(19, 19), null);
  assert.equal(getSwipeDirection(0, 0), null);
  assert.equal(getSwipeDirection(-20, 0), 'left');
  assert.equal(getSwipeDirection(40, 30), 'right');
  assert.equal(getSwipeDirection(5, -30), 'up');
  assert.equal(getSwipeDirection(-10, 30), 'down');
});

test('625 líneas: tamaño y suma conservados, valores válidos', () => {
  const values = [0, 2, 4, 8, 16];
  for (const a of values) for (const b of values) for (const c of values) for (const d of values) {
    const input = [a, b, c, d];
    const result = moveLineLeft(input);
    assert.equal(result.line.length, 4);
    assert.equal(sum([result.line]), sum([input]));
    assert.ok(result.line.every(value => [0, 2, 4, 8, 16, 32].includes(value)));
    assert.ok(result.points >= 0);
  }
});
