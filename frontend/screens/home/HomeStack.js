import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NewsFeedScreen from './NewsFeedScreen';
import PostDetailScreen from './PostDetailScreen';
import UserProfileScreen from './UserProfileScreen';
import CreatePostScreen from './CreatePostScreen';

const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator 
      initialRouteName="NewsFeed"
    >
      <Stack.Screen 
        name="NewsFeed" 
        component={NewsFeedScreen} 
        options={{ 
          title: 'Home'
        }} 
      />

      <Stack.Screen 
        name="PostDetail" 
        component={PostDetailScreen} 
        options={{ title: 'Post' }} 
      />

      <Stack.Screen 
        name="UserProfile" 
        component={UserProfileScreen} 
        options={({ route }) => ({ title: route.params.username })}
      />

      <Stack.Screen 
        name="CreatePost" 
        component={CreatePostScreen} 
        options={{ 
          title: 'Create Post',
          // Use 'presentation: 'modal'' to make it slide up from the bottom
          presentation: 'modal' 
        }}
      />
    </Stack.Navigator>
  );
}

export default HomeStack;