import { Text, View, Pressable } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { styles } from "../styles";

export default function GameOver() {
  const { score = "0", reason } = useLocalSearchParams<{ score: string; reason: string }>();
  return (
    <View style={styles.container}>
      <Text>GAME OVER</Text>
      <Text style={{ margin: 10 }}>{reason === "blocked" ? "Ya no quedan movimientos posibles." : "Has terminado esta partida."}</Text>
      <Text style={styles.buttonText}>Score: <Text testID="final-score">{score}</Text></Text>
      <Pressable accessibilityRole="button" style={styles.button} onPress={() => router.replace("/game")}>
        <Text style={styles.buttonText}>Volver a jugar</Text>
      </Pressable>
      <Pressable accessibilityRole="button" style={styles.button} onPress={() => router.replace("/")}>
        <Text style={styles.buttonText}>Inicio</Text>
      </Pressable>
    </View>
  );
}
