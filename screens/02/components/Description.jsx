import React, { useState, useEffect } from "react";
import { View, Text, Button, Alert, ActivityIndicator } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getFirestore, doc, updateDoc, getDoc, onSnapshot } from "firebase/firestore";
import { appFirebase } from '../../../FirebaseService/firebaseCredenciales';
import { getAuth } from 'firebase/auth';

const db = getFirestore(appFirebase);

const Description = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { productName, status, productId } = route.params || {};
    const [donationRequested, setDonationRequested] = useState(status === "Pendiente");
    const [nroSolicitud, setNroSolicitud] = useState(null);
    const [loading, setLoading] = useState(false);
    const [cancelLoading, setCancelLoading] = useState(false);
    const [requestedBy, setRequestedBy] = useState(null);
    const [productStatus, setProductStatus] = useState(status);
    const [productDeleted, setProductDeleted] = useState(false);

    // Obtener el usuario actual
    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            setRequestedBy(user.email); // O user.displayName
        }
    }, []);

    // Efecto para escuchar cambios en el producto
    useEffect(() => {
        const productRef = doc(db, "products", productId);
        
        const unsubscribe = onSnapshot(productRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setProductStatus(data.status);
                setDonationRequested(data.status === "Pendiente");
                setNroSolicitud(data.nroSolicitud); // Obtener el nroSolicitud almacenado
                setProductDeleted(false);
            } else {
                // Si el documento no existe, actualizar el estado y mostrar un mensaje
                setProductDeleted(true);
                setProductStatus("El producto fue eliminado o entregado.");
            }
        });

        return () => unsubscribe(); // Limpiar el listener al desmontar
    }, [productId]);

    const handleRequestDonation = async () => {
        if (productName && productId && !donationRequested) {
            const randomCode = Math.floor(100 + Math.random() * 900);
            setNroSolicitud(randomCode);
            setDonationRequested(true);
            setLoading(true);

            const productRef = doc(db, "products", productId);
            try {
                await updateDoc(productRef, { 
                    status: "Pendiente", 
                    requestedBy: requestedBy,
                    nroSolicitud: randomCode
                });
                setProductStatus("Pendiente");
                Alert.alert(`Solicitud de donación para ${productName} enviada. Código: ${randomCode}`);
            } catch (error) {
                console.error("Error updating product:", error);
                Alert.alert("Ocurrió un error al actualizar el estado del producto.");
            } finally {
                setLoading(false);
            }
        } else {
            Alert.alert("No se ha definido el nombre del producto o el ID del producto.");
        }
    };

    const handleCancelDonation = async () => {
        if (productId) {
            setCancelLoading(true);
            const productRef = doc(db, "products", productId);
            try {
                await updateDoc(productRef, { 
                    status: "activo", 
                    requestedBy: null,
                    nroSolicitud: null // Restablecer nroSolicitud a null
                });
                setDonationRequested(false);
                setNroSolicitud(null);
                setProductStatus("activo");
                Alert.alert(`Solicitud de donación para ${productName} cancelada.`);
            } catch (error) {
                console.error("Error updating product:", error);
                Alert.alert("Ocurrió un error al cancelar la solicitud.");
            } finally {
                setCancelLoading(false);
            }
        }
    };

    if (productDeleted) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text className="text-lg font-bold">{productStatus}</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 justify-center items-center">
            <Text className="text-xl font-bold">{`Nombre del Producto: ${productName || 'Desconocido'}`}</Text>
            <Text className="text-lg">{`Estado: ${productStatus}`}</Text>
            {donationRequested ? (
                <>
                    <Text className="text-lg">{`Código de Solicitud: ${nroSolicitud}`}</Text>
                    <Button
                        title={cancelLoading ? "Cancelando..." : "Cancelar Solicitud"}
                        onPress={handleCancelDonation}
                        color="red"
                        disabled={cancelLoading}
                    />
                    {cancelLoading && <ActivityIndicator size="small" color="#fff" />}
                </>
            ) : (
                productStatus !== "Pendiente" && (
                    <Button
                        title={loading ? "Solicitando..." : "Solicitar Donación"}
                        onPress={handleRequestDonation}
                        disabled={loading}
                    />
                )
            )}
            {loading && <ActivityIndicator size="small" color="#0000ff" />}
        </View>
    );
};

export default Description;
