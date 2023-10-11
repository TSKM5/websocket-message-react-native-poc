import { View } from 'react-native';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthLanding from './src/pages/AuthLanding';
import ChatScreen from './src/pages/ChatScreen';
import { WebSocketProvider } from './src/context/WebSocketContext';

const Stack = createStackNavigator();

export default function App() {
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'white'
    },
  };
  return (
    <WebSocketProvider>
      <View style={{flex:1}}>
        <NavigationContainer theme={theme}>
          <Stack.Navigator
            initialRouteName={'AuthLanding'}
            screenOptions={{
              headerShown:false,
            }}
          >
            <Stack.Screen
              name={'AuthLanding'}
              component={AuthLanding}
            />
            <Stack.Screen
              name={'ChatScreen'}
              component={ChatScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </WebSocketProvider>
  );
}
