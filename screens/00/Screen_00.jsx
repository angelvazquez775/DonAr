import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { getAuth } from 'firebase/auth';
import List00 from './components_00/List00';
import Nav from "./components_00/Nav";

const Screen_01 = () => {
    const [username, setUsername] = useState(''); 

    useEffect(() => {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (currentUser) {
            setUsername(currentUser.email); 
        } else {
            console.error('No hay usuario conectado.');
        }
    }, []);

    return (
        <View className="flex-1 bg-blue-400">
            <Nav />
            <View className="flex-1"> 
                <List00 />
            </View>
        </View>
    );
};

export default Screen_01;
