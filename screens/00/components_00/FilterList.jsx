import React, { useState } from "react";
import { View, Pressable, Text, Image } from "react-native";

import mercaderiaImg from '../../../assets/img/Mercaderia.png';
import juguetesImg from '../../../assets/img/Juguetes.png';
import ropaImg from '../../../assets/img/Ropa.png';

function FilterList({ onFilterChange }) {
    const [filterPressed, setFilterPressed] = useState([false, false, false]);

    const handlePressIn = (index) => {
        const newStates = [false, false, false];
        newStates[index] = true;
        setFilterPressed(newStates);
        onFilterChange(index); // Llama a la función de filtrado
    };

    return (
        <View className="flex flex-row justify-between p-4">
            <Pressable
                key={0}
                className={`flex-1 mx-2 p-3 rounded items-center shadow-md ${filterPressed[0] ? 'bg-gray-400' : 'bg-gray-300'}`}
                onPressIn={() => handlePressIn(0)}
            >
                <Image source={mercaderiaImg} className="h-20 w-20" />
                <Text className="text-center">Mercadería</Text>
            </Pressable>
            <Pressable
                key={1}
                className={`flex-1 mx-2 p-3 rounded items-center shadow-md ${filterPressed[1] ? 'bg-gray-400' : 'bg-gray-300'}`}
                onPressIn={() => handlePressIn(1)}
            >
                <Image source={juguetesImg} className="h-20 w-20" />
                <Text className="text-center">Juguetes</Text>
            </Pressable>
            <Pressable
                key={2}
                className={`flex-1 mx-2 p-3 rounded items-center shadow-md ${filterPressed[2] ? 'bg-gray-400' : 'bg-gray-300'}`}
                onPressIn={() => handlePressIn(2)}
            >
                <Image source={ropaImg} className="h-20 w-20" />
                <Text className="text-center">Ropa</Text>
            </Pressable>
        </View>
    );
}

export default FilterList;
