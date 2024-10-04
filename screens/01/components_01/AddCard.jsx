import React, { useState } from 'react';
import { View, Pressable, Text } from 'react-native';
import { styled } from 'nativewind';

function AddCard({ onPress }) {
    const [isPressed, setIsPressed] = useState(false);

    return (
        <View>
            <Pressable
                onPressIn={() => setIsPressed(true)} 
                onPressOut={() => setIsPressed(false)} 
                onPress={onPress}
                className={`p-3 rounded ${isPressed ? 'bg-yellow-500' : 'bg-yellow-400'}`} 
            >
                <Text className="text-lg text-black text-center">Crear donación + </Text>
            </Pressable>
        </View>
    );
}

export default AddCard;
