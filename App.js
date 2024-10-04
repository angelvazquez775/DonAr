import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Screen_00 from './screens/00/Screen_00.jsx'; 
import Screen_01 from './screens/01/Screen_01.jsx';
import Screen_02 from './screens/02/Screen_02.jsx';
import Screen_03 from './screens/03/Screen_03.jsx';
import React, { useState } from 'react'; // Importa useState

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
            name="LogIn" 
            component={Screen_03} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Inicio" 
            component={Screen_00} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Donaciones" 
            component={Screen_01}
            options={{ title: 'Mis Donaciones' }}
          >
          </Stack.Screen>
          <Stack.Screen
            name='Mapa'
            component={Screen_02}
            options={{ title: 'Mapa de productos' }}
          >
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
