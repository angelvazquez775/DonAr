import React, { useState, useEffect } from 'react';
import { View, Text, Modal, Pressable } from 'react-native';
import { styled } from 'nativewind';
import AddCard from './components_01/AddCard';
import AddForm from './components_01/AddForm';
import { getAuth } from 'firebase/auth';
import ProductList from './components_01/ProductList';

const Screen_01 = ({location}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [username, setUsername] = useState(''); // Estado para el nombre de usuario

    useEffect(() => {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (currentUser) {
            setUsername(currentUser.email); // O usa currentUser.displayName si está configurado
        } else {
            console.error('No hay usuario conectado.');
        }
    }, []);

    return (
        <View className="flex-1 items-center bg-blue-400 relative">
            <ProductList currentUser={username} /> 
            <View className="absolute bottom-10 right-8">
                <AddCard onPress={() => setModalVisible(true)} />
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center bg-blue-400">
                    <View className="w-11/12 bg-white rounded-lg p-4">
                        <AddForm 
                            username={username} // Pasar el nombre de usuario a AddForm
                        />
                        <Pressable onPress={() => setModalVisible(false)} className="bg-red-500 p-3 rounded mt-4 w-64 ml-11">
                            <Text className="text-white text-center">Cerrar</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default Screen_01;
