import { View, Text, TouchableOpacity } from "react-native";

export default function SettingsHomeScreen({ navigation }) {
  return (
    <View style={{ padding: 20 }}>
      <TouchableOpacity 
        onPress={() => navigation.navigate("ProfileSettings")}
        style={{ padding: 15 }}
      >
        <Text>Profile Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => navigation.navigate("AccountSettings")}
        style={{ padding: 15 }}
      >
        <Text>Account & Security</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => navigation.navigate("PrivacySettings")}
        style={{ padding: 15 }}
      >
        <Text>Privacy Settings</Text>
      </TouchableOpacity>
    </View>
  );
}
