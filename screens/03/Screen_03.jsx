// Screen_03.jsx
import { View } from "react-native";
import FormLogIn from "./components_03/FormLogIn.jsx";

function Screen_03() {
    return (
        <View className="flex-1 justify-center items-center bg-blue-400 p-4">
            <View className="w-full max-w-sm"> 
                <FormLogIn />
            </View>
        </View>
    );
}

export default Screen_03;
