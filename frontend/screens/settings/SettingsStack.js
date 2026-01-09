import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsListScreen from './SettingsListScreen'
import ProfileScreen from './ProfileScreen'
import PrivacyScreen from './PrivacyScreen'

const Stack = createNativeStackNavigator();

function SettingsStack() {
  return (
    <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#fff' },
      headerShadowVisible: false,
      headerTitleStyle: { fontWeight: '700', color: '#1e293b' },
      headerTintColor: '#4f46e5',
    }}
    >
    <Stack.Screen name="SettingsList" component={SettingsListScreen} options={{ title: 'Settings' }} />
    <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Edit Profile' }} />
    <Stack.Screen name="Privacy" component={PrivacyScreen} options={{ title: 'Privacy' }} />
    </Stack.Navigator>
  );
}

export default SettingsStack;
