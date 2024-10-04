import React, { useState, useEffect } from "react";
import { View, Text, Button, ActivityIndicator } from "react-native";
import { getFirestore, doc, deleteDoc, onSnapshot } from "firebase/firestore";
import { appFirebase } from '../../../FirebaseService/firebaseCredenciales';

const db = getFirestore(appFirebase);

function ProductCard({ product, onDelete, currentUser }) {
    const [isLoading, setIsLoading] = useState(false);
    const [nroSolicitud, setNroSolicitud] = useState(null);
    const [loadingNro, setLoadingNro] = useState(true);

    useEffect(() => {
        const productRef = doc(db, 'products', product.id);
        
        // Escuchar cambios en tiempo real
        const unsubscribe = onSnapshot(productRef, (docSnap) => {
            if (docSnap.exists()) {
                setNroSolicitud(docSnap.data().nroSolicitud);
            }
            setLoadingNro(false);
        });

        return () => unsubscribe(); // Limpiar el listener al desmontar
    }, [product.id]);

    const handleDelete = async () => {
        setIsLoading(true); 
        try {
            await deleteDoc(doc(db, 'products', product.id));
            onDelete(product.id);
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        } finally {
            setIsLoading(false); 
        }
    };

    // No mostrar la tarjeta si el usuario no es el propietario
    if (product.username !== currentUser) {
        return null; 
    }

    return (
        <View className="bg-white p-4 m-2 rounded-lg shadow-md">
            <Text className="text-lg font-bold">{`Producto: ${product.productName}`}</Text>
            <Text>{`Categoría: ${product.category}`}</Text>
            {product.category === 'Mercaderia' && (
                <Text>{`Fecha de vencimiento: ${product.expirationDate}`}</Text>
            )}
            <Text>{`Publicado por: ${product.username}`}</Text>
            <Text>{`Estado: ${product.status}`}</Text>

            {loadingNro ? (
                <ActivityIndicator size="small" color="#0000ff" />
            ) : nroSolicitud !== null ? (
                <>
                    <Text className="text-xl font-bold mt-2">{`Número de Solicitud: ${nroSolicitud}`}</Text>
                    <Text className="text-sm text-red-500">
                        Antes de confirmar, verifique que el número de solicitud sea correcto.
                    </Text>
                </>
            ) : null} 

            <View className="flex-row justify-between mt-4">
                {nroSolicitud !== null && !isLoading && (
                    <Button 
                        title="Confirmar" 
                        onPress={handleDelete} // Cambia esto por la función adecuada si es necesario
                        style={{ flex: 1, marginRight: 10 }} // Espacio entre botones
                    />
                )}
                <Button 
                    title="Eliminar" 
                    color="red" 
                    onPress={handleDelete} 
                    style={{ flex: 1 }} 
                />
            </View>
        </View>
    );
}

export default ProductCard;
