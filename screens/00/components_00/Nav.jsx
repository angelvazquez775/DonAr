import { View, Pressable, Text } from "react-native";
import { styled } from "tailwindcss-react-native";
import MainIcon from "../../../assets/icons/MainIcon.jsx"
import React, {useState} from "react";
import { useNavigation } from "@react-navigation/native";
function Nav () {

    const [pressed, setPressed] = useState(false)
    const navigation = useNavigation()


    return(
        <View className="flex flex-row items-center justify-between p-6 mt-6">
            <MainIcon ></MainIcon>
            <Pressable className={`p-3 rounded shadow-md ${pressed ? 'bg-yellow-500' : 'bg-yellow-400'}`}
                onPressIn={() => setPressed(true)}
                onPressOut={() => setPressed(false)}
                onPress={() => navigation.navigate('Donaciones')}
            >
                <Text>Mis donaciones</Text>
            </Pressable>
        </View>
    )
}

export default Nav