import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { ref, push, set } from 'firebase/database';
import { db } from '../firebase/Config';

export default function NuevoPedidoScreen({ navigation }: any) {
  const [cliente, setCliente] = useState('');
  const [servicio, setServicio] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [precio, setPrecio] = useState('');

  const guardarPedido = async () => {
    if (!cliente || !servicio || !ubicacion || !precio) {
      Alert.alert("Todos los campos son obligatorios");
      return;
    }
    try {
      const pedidosRef = ref(db, "pedidos");
      const nuevoPedidoRef = push(pedidosRef);
      await set(nuevoPedidoRef, {
        cliente,
        servicio,
        ubicacion,
        precio: parseFloat(precio),
        estado: "Pendiente"
      });
      Alert.alert("Pedido enviado!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error al enviar pedido");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nuevo Pedido</Text>
      <TextInput
        style={styles.input}
        placeholder="Cliente"
        value={cliente}
        onChangeText={setCliente}
      />
      <TextInput
        style={styles.input}
        placeholder="Servicio"
        value={servicio}
        onChangeText={setServicio}
      />
      <TextInput
        style={styles.input}
        placeholder="Ubicación"
        value={ubicacion}
        onChangeText={setUbicacion}
      />
      <TextInput
        style={styles.input}
        placeholder="Precio"
        value={precio}
        onChangeText={setPrecio}
        keyboardType="decimal-pad"
      />
      <Button title="Enviar Pedido" onPress={guardarPedido} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center', padding:20 },
  title: { fontSize:28, fontWeight:'bold', marginBottom:20 },
  input: { width:'100%', borderWidth:1, borderColor:'#ccc', borderRadius:8, padding:10, marginBottom:10 }
});
