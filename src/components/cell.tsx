import { Text, View } from "react-native";
import { styles } from "../styles";

type CellProps = { value: number; size: number };

export default function Cell({ value, size }: CellProps) {
  return (
    <View testID="tile" style={{
      pointerEvents: "none",
      width: size,
      height: size,
      borderWidth: 1,
      borderColor: "#8f8f8f",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: value === 0 ? "#ddd" : "#fff",
    }}>
      <Text testID="tile-value" style={styles.buttonText}>{value === 0 ? "" : value}</Text>
    </View>
  );
}
