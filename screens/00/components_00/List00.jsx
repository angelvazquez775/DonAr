import React, { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator, Text } from "react-native";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";
import { appFirebase } from '../../../FirebaseService/firebaseCredenciales';
import Card00 from "./Card00";
import FilterList from "./FilterList";
import { getAuth } from 'firebase/auth';
import { useFocusEffect } from '@react-navigation/native';

const db = getFirestore(appFirebase);

function List00() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState(null); // Estado para el filtro
    const [currentUser, setCurrentUser] = useState('');

    useEffect(() => {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (currentUser) {
            setCurrentUser(currentUser.email); // O usa currentUser.displayName si está configurado
        } else {
            console.error('No hay usuario conectado.');
        }
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            const unsubscribe = onSnapshot(collection(db, 'products'), (querySnapshot) => {
                const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setProducts(productsData);
                setIsLoading(false); // Finalizar la carga
            }, (error) => {
                console.error('Error al obtener los productos:', error);
                setIsLoading(false); // Finalizar la carga en caso de error
            });

            // Limpia el listener cuando el componente se desmonta o se enfoca de nuevo
            return () => unsubscribe();
        }, [])
    );

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    const filteredProducts = products.filter(product => {
        if (product.username === currentUser) {
            return false;
        }
        if (filter !== null) {
            return product.category === ['Mercaderia', 'Juguetes', 'Ropa'][filter];
        }
        
        return true; 
    });

    const handleFilterChange = (index) => {
        setFilter(index); // Actualizar el estado del filtro
    };

    return (
        <View className="flex-1"> 
            <FilterList onFilterChange={handleFilterChange} />
            {filteredProducts.length === 0 ? (
                <View className="flex-1 justify-center items-center">
                    <Text className="text-lg">No hay donaciones activas.</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredProducts}
                    renderItem={({ item }) => (
                        <Card00 
                            product={item} 
                            currentUser={currentUser}
                        />
                    )}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ paddingBottom: 20 }} // Espacio al final
                    showsVerticalScrollIndicator={false} // Quitar la barra de desplazamiento
                />
            )}
        </View>
    );
}

export default List00;
