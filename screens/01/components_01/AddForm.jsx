import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Pressable, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';
import { appFirebase } from '../../../FirebaseService/firebaseCredenciales';
import { getFirestore, collection, addDoc, doc } from 'firebase/firestore';

const db = getFirestore(appFirebase);

function AddForm({ username }) {
    const [productName, setProductName] = useState('');
    const [category, setCategory] = useState('Mercaderia');
    const [expirationDate, setExpirationDate] = useState('');
    const [location, setLocation] = useState(null);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
    const [isSubmitPressed, setIsSubmitPressed] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setError('Permiso de ubicación denegado.');
            }
        })();
    }, []);

    const handleLocation = async () => {
        setError('');
        setSuccessMessage('');
        setIsLoadingLocation(true);

        try {
            const { coords } = await Location.getCurrentPositionAsync({});
            setLocation({ latitude: coords.latitude, longitude: coords.longitude });
            setSuccessMessage('Estamos usando tu ubicación para mostrar el producto en el mapa.');
        } catch (error) {
            setError('No se pudo obtener la ubicación.');
            console.error(error);
        } finally {
            setIsLoadingLocation(false);
        }
    };

    const isValidDate = (dateString) => {
        const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(20[0-9]{2})$/;
        if (!regex.test(dateString)) return false;

        const [day, month, year] = dateString.split('/').map(Number);
        const date = new Date(year, month - 1, day);

        return date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
    };

    const handleSubmit = async () => {
        setError('');
        setSuccessMessage('');
        setIsLoadingSubmit(true);

        if (!productName || !category || (category === 'Mercaderia' && !expirationDate) || !location) {
            setError('Todos los campos son obligatorios.');
            setIsLoadingSubmit(false);
            return;
        }

        if (category === 'Mercaderia' && !isValidDate(expirationDate)) {
            setError('La fecha de vencimiento debe estar en formato DD/MM/AAAA y ser una fecha válida.');
            setIsLoadingSubmit(false);
            return;
        }

        const productId = doc(collection(db, 'products')).id; // Generar un ID único

        const newProduct = {
            productId,
            productName,
            category,
            expirationDate: category === 'Mercaderia' ? expirationDate : null,
            location,
            username,
            requestedBy: null,
            status: 'activo',
            nroSolicitud: null, // Agregar el nuevo campo nroSolicitud con valor null
        };

        try {
            await addDoc(collection(db, 'products'), newProduct);
            setSuccessMessage('Producto cargado correctamente');
            resetForm();
        } catch (error) {
            setError('Error al guardar el producto en Firestore.');
            console.error(error);
        } finally {
            setIsLoadingSubmit(false);
            setIsSubmitPressed(false);
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        }
    };

    const resetForm = () => {
        setProductName('');
        setCategory('Mercaderia');
        setExpirationDate('');
        setLocation(null);
    };

    return (
        <View className="p-4 bg-white rounded">
            <TextInput
                placeholder="Nombre del producto"
                placeholderTextColor={'#888'}
                value={productName}
                onChangeText={setProductName}
                className="p-3 rounded bg-gray-200 mb-4"
            />
            <Picker
                selectedValue={category}
                onValueChange={(itemValue) => setCategory(itemValue)}
                className="border p-2 rounded bg-gray-200 mb-4"
            >
                <Picker.Item label="Mercaderia" value="Mercaderia" />
                <Picker.Item label="Ropa" value="Ropa" />
                <Picker.Item label="Juguetes" value="Juguetes" />
            </Picker>
            {category === 'Mercaderia' && (
                <TextInput
                    placeholder="Fecha de vencimiento DD/MM/AAAA"
                    placeholderTextColor={'#888'}
                    value={expirationDate}
                    onChangeText={setExpirationDate}
                    className="rounded p-3 mb-4 bg-gray-200"
                />
            )}
            <Pressable
                onPress={handleLocation}
                className={`mb-4 p-3 rounded bg-green-400`}
            >
                <Text className="text-center text-white">Usar mi ubicación</Text>
            </Pressable>
            {isLoadingLocation && (
                <View className="flex-row items-center mb-4">
                    <ActivityIndicator size="small" color="#0000ff" />
                    <Text className="ml-2">Obteniendo ubicación...</Text>
                </View>
            )}
            {error ? (
                <Text className="text-red-500 mb-4">{error}</Text>
            ) : null}
            {successMessage ? (
                <Text className="text-green-500 mb-4">{successMessage}</Text>
            ) : null}
            <Pressable
                onPressIn={() => setIsSubmitPressed(true)}
                onPressOut={() => setIsSubmitPressed(false)}
                onPress={handleSubmit}
                className={`bg-blue-500 p-3 rounded ${isSubmitPressed ? 'bg-blue-700' : ''}`}
            >
                <Text className="text-white text-center">
                    {isLoadingSubmit ? 'Cargando...' : 'Enviar'}
                </Text>
            </Pressable>
            {isLoadingSubmit && (
                <ActivityIndicator size="large" color="#0000ff" className="mt-4" />
            )}
        </View>
    );
}

export default AddForm;
