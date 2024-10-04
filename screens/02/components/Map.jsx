import React from 'react';
import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { styled } from 'nativewind'; // Importa los estilos de NativeWind

const Map = ({ latitude, longitude }) => {
    const region = {
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    };

    return (
        <View className="flex-1">
            <MapView
                style={{ flex: 1 }} // NativeWind no aplica estilos en línea
                initialRegion={region}
            >
                <Marker
                    coordinate={{ latitude, longitude }}
                    title="Ubicación del dispositivo"
                    description={`Lat: ${latitude}, Lon: ${longitude}`}
                />
            </MapView>
        </View>
    );
};

export default Map;
