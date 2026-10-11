import { Text, View, Pressable } from "react-native";
import { router } from "expo-router";
import { styles } from "../styles";

export default function Credits() {
  return (
    <View style={styles.container}>
      <Text style={styles.buttonText}>Créditos</Text>
      <Text style={{ margin: 20, textAlign: "center" }}>Aristide CORDONNIER{"\n"}Mathis GIL{"\n"}Oscar BUAT{"\n\n"}APLICACIONES MÓVILES{"\n"}Universidad La Salle México{"\n\n"}React Native, Expo y Expo Router.{"\n"}Mecánica 2048 de Gabriele Cirulli.</Text>
      <Pressable accessibilityRole="button" style={styles.button} onPress={() => router.canGoBack() ? router.back() : router.replace("/")}>
        <Text style={styles.buttonText}>Volver</Text>
      </Pressable>
    </View>
  );
}
