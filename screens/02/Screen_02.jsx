import React from 'react';
import { View, SafeAreaView, Text } from 'react-native';
import Map from './components/Map';
import Description from './components/Description';
import { useRoute } from '@react-navigation/native';

const Screen_02 = () => {
    const route = useRoute();
    const { location, productName, status, productId, requestedBy, nroSolicitud } = route.params || {};
    const latitude = location?.latitude;
    const longitude = location?.longitude;

    return (
        <SafeAreaView className="flex-1">
            <View className="flex-1">
                {latitude && longitude ? (
                    <Map latitude={latitude} longitude={longitude} />
                ) : (
                    <View className="flex-1 justify-center items-center">
                        <Text>No hay ubicación disponible.</Text>
                    </View>
                )}
            </View>
            <View className="h-1/5">
                <Description productName={productName} status={status} productId={productId} />
            </View>
        </SafeAreaView>
    );
};

export default Screen_02;
