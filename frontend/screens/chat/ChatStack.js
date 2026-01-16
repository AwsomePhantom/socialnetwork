import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ConversationListScreen from './ConversationListScreen';
import ChatRoomScreen from './ChatRoomScreen';

const Stack = createNativeStackNavigator();

function ChatStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Conversations" 
        component={ConversationListScreen} 
        options={{ title: 'Chats' }} 
      />
      <Stack.Screen 
        name="ChatRoom" 
        component={ChatRoomScreen} 
      />
    </Stack.Navigator>
  );
}

export default ChatStack;