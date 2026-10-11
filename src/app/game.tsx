import { Text, View, StyleSheet, Pressable, PanResponder, useWindowDimensions } from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import Cell from "../components/cell";
import { styles } from "../styles";
import { addRandomTile, createBoard, getSwipeDirection, isGameOver, moveBoard } from "../utils/board";
import type { Direction } from "../utils/board";

function createGame() {
  return { board: createBoard(), score: 0 };
}

export default function GameScreen() {
  const { width } = useWindowDimensions();
  const boardSize = Math.min(width * 0.9, 320);
  const cellSize = boardSize / 4;
  const [game, setGame] = useState(createGame);

  const finishGame = (score: number, reason: string) => {
    router.replace({ pathname: "/gameover", params: { score, reason } });
  };

  // Comprobar el tablero nuevo después de cambiar el estado.
  useEffect(() => {
    if (isGameOver(game.board)) {
      router.replace({ pathname: "/gameover", params: { score: game.score, reason: "blocked" } });
    }
  }, [game]);

  const play = (direction: Direction) => {
    setGame(current => {
      const result = moveBoard(current.board, direction);
      // Si el tablero no cambia, no añadir fichas ni puntos.
      if (!result.changed) return current;
      return { board: addRandomTile(result.board), score: current.score + result.points };
    });
  };

  // Al soltar el dedo, elegir una sola dirección.
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: event => event.preventDefault(),
    onPanResponderRelease: (_event, gesture) => {
      const direction = getSwipeDirection(gesture.dx, gesture.dy);
      if (direction) play(direction);
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.buttonText}>Score: <Text testID="score">{game.score}</Text></Text>
      <View testID="board" style={[gameStyles.board, { width: boardSize, height: boardSize }]} {...panResponder.panHandlers}>
        {game.board.map((row, rowIndex) => row.map((value, colIndex) => (
          <Cell key={`${rowIndex}-${colIndex}`} value={value} size={cellSize} />
        )))}
      </View>
      <Text style={gameStyles.hint}>Desliza el dedo para jugar</Text>
      <Pressable accessibilityRole="button" style={styles.button} onPress={() => finishGame(game.score, "retired")}>
        <Text style={styles.buttonText}>Terminar juego</Text>
      </Pressable>
    </View>
  );
}

const gameStyles = StyleSheet.create({
  board: { backgroundColor: "#ddd", flexDirection: "row", flexWrap: "wrap", touchAction: "none" },
  hint: { fontSize: 16, color: "#214421", marginTop: 8 },
});
