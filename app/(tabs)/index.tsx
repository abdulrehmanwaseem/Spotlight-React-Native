import { Text, View } from "react-native";
import { Link } from "expo-router";

export default function Home() {
  return (
    <View>
      <Text>Visit Notifications Screen</Text>
      <Link href={"/notifications"}>Notifications screen </Link>
    </View>
  );
}
