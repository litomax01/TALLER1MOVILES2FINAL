import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase/Config';

export default function ListaPedidosScreen({ navigation }: any) {
  const [pedidos, setPedidos] = useState<any[]>([]);

  useEffect(() => {
    const pedidosRef = ref(db, 'pedidos');
    const unsubscribe = onValue(pedidosRef, (snapshot) => {
      const data = snapshot.val();
      const pedidosArray = data
        ? Object.entries(data).map(([id, values]: any) => ({ id, ...values }))
        : [];
      setPedidos(pedidosArray);
    });
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pedidos</Text>

      <ScrollView style={styles.scroll}>
        {pedidos.length === 0 && (
          <Text style={styles.text}>No hay pedidos activos.</Text>
        )}
        {pedidos.map((pedido) => (
          <View key={pedido.id} style={styles.pedidoCard}>
            <Text style={styles.pedidoText}>
              Cliente: {pedido.cliente}
            </Text>
            <Text style={styles.pedidoText}>
              Producto: {pedido.producto}
            </Text>
            <Text style={styles.pedidoText}>
              Cantidad: {pedido.cantidad}
            </Text>
            <Text style={styles.pedidoText}>
              Estado: {pedido.estado || "Pendiente"}
            </Text>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.boton} onPress={() => navigation.goBack()}>
        <Text style={styles.botonTexto}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20, alignItems:'center', backgroundColor:'#f0f8ff' },
  title: { fontSize:32, fontWeight:'bold', color:'#2e7d32', marginBottom:20 },
  scroll: { alignSelf:'stretch', marginBottom:20 },
  pedidoCard: { backgroundColor:'#fff', borderRadius:10, padding:15, marginBottom:12, elevation:2 },
  pedidoText: { fontSize:17, color:'#444', marginBottom:2 },
  text: { fontSize:18, color:'#333', textAlign:'center', marginVertical:15 },
  boton: { backgroundColor:'#2e7d32', padding:12, borderRadius:8, marginBottom:20, alignSelf:'center' },
  botonTexto: { color:'#fff', fontSize:16, fontWeight:'bold' }
});
