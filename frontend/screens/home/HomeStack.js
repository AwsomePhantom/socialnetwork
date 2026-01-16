import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NewsFeedScreen from './NewsFeedScreen'
import PostDetailScreen from './PostDetailScreen'
import UserProfileScreen from './UserProfileScreen'
import CreatePostScreen from './CreatePostScreen'

const Stack = createNativeStackNavigator();
function HomeStack() {
  return (
    <Stack.Navigator
    initialRouteName="NewsFeed"
    screenOptions={{
      headerStyle: { backgroundColor: '#fff' },
      headerShadowVisible: false,
      headerTitleStyle: { fontWeight: '700', color: '#1e293b', fontSize: 18 },
      headerTintColor: '#4f46e5', // Global color for back buttons
    }}
    >
    <Stack.Screen name="NewsFeed" component={NewsFeedScreen} options={{ title: 'Feed' }} />
    <Stack.Screen name="PostDetail" component={PostDetailScreen} options={{ title: 'Post' }} />
    <Stack.Screen name="UserProfile" component={UserProfileScreen} options={({ route }) => ({ title: route.params?.username || 'Profile' })} />
    <Stack.Screen name="CreatePost" component={CreatePostScreen} options={{ headerShown: false, presentation: 'modal' }} />
    </Stack.Navigator>
  );
}
export default HomeStack;
