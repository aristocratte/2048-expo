import { Text, View, Pressable } from "react-native";
import { router } from "expo-router";
import { styles } from "../styles";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.buttonText}>2048</Text>
      <Text style={{ margin: 20, textAlign: "center" }}>Une números iguales para llegar a 2048.{"\n\n"}Desliza el dedo sobre el tablero. 2 + 2 = 4.{"\n"}Cada fusión suma puntos. La partida termina si ya no puedes mover.</Text>
      <Pressable accessibilityRole="button" style={styles.button} onPress={() => router.replace("/game")}>
        <Text style={styles.buttonText}>Jugar</Text>
      </Pressable>
      <Pressable accessibilityRole="button" style={styles.button} onPress={() => router.push("/credits")}>
        <Text style={styles.buttonText}>Créditos</Text>
      </Pressable>
    </View>
  );
}
