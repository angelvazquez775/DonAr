import React, { useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator } from "react-native";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { appFirebase } from '../../../FirebaseService/firebaseCredenciales';
import { useNavigation } from "@react-navigation/native";
import { getAuth } from 'firebase/auth';

const db = getFirestore(appFirebase);

function Card00({ product }) {
    const navigation = useNavigation();
    const [location, setLocation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            setCurrentUser(user.email); // O usa user.displayName si está configurado
        } else {
            console.error('No hay usuario conectado.');
        }
    }, []);

    // Verifica si el usuario es el actual
    if (product.username === currentUser) {
        return null; 
    }

    // Efecto para obtener la ubicación del producto
    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const docRef = doc(db, "products", product.id); 
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setLocation(data.location);
                } else {
                    console.log("No se encontró el documento.");
                }
            } catch (error) {
                console.error("Error al obtener la ubicación:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLocation();
    }, [product.id]);

    // Si todavía está cargando, muestra un indicador de carga
    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    const handleGoToMap = () => {
        navigation.navigate("Mapa", { 
            location, 
            productName: product.productName, 
            status: product.status,
            productId: product.id,
            requestedBy: product.requestedBy || null, // Manejo de caso donde requestedBy no existe
        }); 
    };
    
    const canViewMap = product.status === "Pendiente" && product.requestedBy === currentUser;

    return (
        <View className="bg-white p-4 m-2 rounded-lg shadow-md">
            <Text className="text-lg font-bold">{`Producto: ${product.productName}`}</Text>
            <Text>{`Categoría: ${product.category}`}</Text>
            {product.category === 'Mercaderia' && (
                <Text>{`Fecha de vencimiento: ${product.expirationDate}`}</Text>
            )}
            <Text>{`Publicado por: ${product.username}`}</Text>
            <Text>{`Estado: ${product.status}`}</Text>

            <Text>{`Solicitado por: ${product.requestedBy || "Aún nadie solicitó este producto"}`}</Text>

            {(product.status !== "Pendiente" || canViewMap) && (
                <Button title="Ver Mapa" onPress={handleGoToMap} />
            )}
        </View>
    );
}

export default Card00;
