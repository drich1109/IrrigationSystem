import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './src/routes/Home';
import { RootStackParamList } from './types'; // Ensure this import path is correct
import History from './src/routes/History';
import Setting from './src/routes/Setting';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

/*   if (loading) {
    return (
      <Loader isVisible={loading} message='Loading... Please Wait!' />
    );
  } */

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName= "Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="History"
          component={History}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Setting"
          component={Setting}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
