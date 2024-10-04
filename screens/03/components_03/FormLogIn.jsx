// FormLogIn.js
import React, { useState } from 'react';
import { View, Alert, ActivityIndicator } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import appFirebase from '../../../FirebaseService/firebaseCredenciales';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const auth = getAuth(appFirebase);

const FormLogIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Estado de carga
  const [isRegisterMode, setIsRegisterMode] = useState(false); // Estado para el modo de registro
  const navigation = useNavigation();

  const logueo = async () => {
    setLoading(true); // Iniciar indicador de carga
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('Inicio');
    } catch (error) {
      setLoading(false); // Detener el indicador de carga
      console.log(error);
      Alert.alert('Error', 'Usuario o contraseña incorrectos.');
    }
  };

  const registro = async () => {
    setLoading(true); // Iniciar indicador de carga
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('Registro exitoso', 'Usuario creado con éxito.');
      navigation.navigate('Inicio'); // Navegar a la pantalla de inicio después del registro
    } catch (error) {
      setLoading(false); // Detener el indicador de carga
      console.log(error);
      Alert.alert('Error', 'Error al crear el usuario. Intenta nuevamente.');
    }
  };

  return (
    <View className="bg-white rounded-lg shadow-md p-6">
      <Text className="text-lg font-bold text-center mb-4">
        {isRegisterMode ? 'Crear Usuario' : 'Iniciar Sesión'}
      </Text>
      <TextInput
        label="Correo Electrónico"
        value={email}
        onChangeText={text => setEmail(text)}
        className="mb-4 h-12"
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
        required
      />
      <TextInput
        label="Contraseña"
        value={password}
        onChangeText={text => setPassword(text)}
        className="mb-4 h-12"
        mode="outlined"
        secureTextEntry
        required
      />
      {isRegisterMode ? (
        <>
          <Button 
            mode="contained" 
            onPress={registro} 
            className="mt-4 h-12 bg-yellow-400 rounded-md" 
            disabled={loading}
            contentStyle={{ justifyContent: 'center' }} // Centrar contenido del botón
          >
            {loading ? <ActivityIndicator color="#fff" /> : 'Registrarse'}
          </Button>
          <Text
            onPress={() => setIsRegisterMode(false)}
            className="mt-4 text-blue-600 text-center"
          >
            ¿Ya tienes una cuenta? Inicia Sesión
          </Text>
        </>
      ) : (
        <>
          <Button 
            mode="contained" 
            onPress={logueo} 
            className="mt-4 h-12 bg-yellow-400 rounded-md" 
            disabled={loading}
            contentStyle={{ justifyContent: 'center' }}
          >
            {loading ? <ActivityIndicator color="#fff" /> : 'Iniciar Sesión'}
          </Button>
          <Text
            onPress={() => setIsRegisterMode(true)}
            className="mt-4 text-blue-600 text-center"
          >
            ¿No tienes una cuenta? Regístrate
          </Text>
        </>
      )}
    </View>
  );
};

export default FormLogIn;
