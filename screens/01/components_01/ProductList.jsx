import React, { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator, Text } from "react-native";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { appFirebase } from '../../../FirebaseService/firebaseCredenciales';
import ProductCard from './ProductCard';

const db = getFirestore(appFirebase);

function ProductList({ currentUser }) {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Estado para el indicador de carga

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'products'), (querySnapshot) => {
            const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProducts(productsData);
            setIsLoading(false); // Desactivar el indicador de carga
        }, (error) => {
            console.error('Error al obtener los productos:', error);
            setIsLoading(false); // Desactivar el indicador de carga en caso de error
        });

        // Limpiar el listener cuando el componente se desmonta
        return () => unsubscribe();
    }, []);

    const handleDelete = (id) => {
        setProducts(products.filter(product => product.id !== id));
    };

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        ); // Mostrar indicador de carga
    }

    const filteredProducts = products.filter(product => product.username === currentUser);

    return (
        <View className="flex-1">
            {filteredProducts.length === 0 ? ( // Verificar si no hay productos
                <View className="flex-1 justify-center items-center">
                    <Text className="text-lg">No hay donaciones activas.</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredProducts}
                    renderItem={({ item }) => (
                        <ProductCard 
                            product={item} 
                            onDelete={handleDelete} 
                            currentUser={currentUser} // Pasar el usuario actual al card
                        />
                    )}
                    keyExtractor={item => item.id}
                />
            )}
        </View>
    );
}

export default ProductList;
