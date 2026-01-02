import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsListScreen from './SettingsListScreen';
import ProfileScreen from './ProfileScreen';
import PrivacyScreen from './PrivacyScreen';

const Stack = createNativeStackNavigator();

function SettingsStack() {
  return (
    <Stack.Navigator>
      {/* Settings' list */}
      <Stack.Screen 
        name="SettingsList" 
        component={SettingsListScreen} 
        options={{ title: 'Settings' }} 
      />

      {/* Sub stack for other setting pages */}
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} />
    </Stack.Navigator>
  );
}

export default SettingsStack;