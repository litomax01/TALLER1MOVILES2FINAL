import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { ref, push, set } from 'firebase/database';
import { db } from '../firebase/Config';

export default function SoporteScreen({ navigation }: any) {
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');

  const enviarSoporte = async () => {
    if (!nombre || !mensaje) {
      Alert.alert("Por favor, llena todos los campos.");
      return;
    }
    try {
      const soporteRef = ref(db, "soporte");
      const nuevoSoporteRef = push(soporteRef);
      await set(nuevoSoporteRef, {
        nombre,
        mensaje,
        fecha: new Date().toISOString()
      });
      Alert.alert("¡Mensaje enviado!", "Te responderemos pronto.");
      setNombre('');
      setMensaje('');
    } catch (error) {
      Alert.alert("Error al enviar mensaje");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Soporte</Text>
      <View style={styles.content}>
        <Text style={styles.text}>¿En qué podemos ayudarte?</Text>
        <TextInput
          style={styles.input}
          placeholder="Tu nombre"
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Describe tu problema o consulta"
          value={mensaje}
          onChangeText={setMensaje}
          multiline
        />
        <TouchableOpacity style={styles.boton} onPress={enviarSoporte}>
          <Text style={styles.botonTexto}>Enviar</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.boton} onPress={() => navigation.goBack()}>
        <Text style={styles.botonTexto}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20, alignItems:'center', justifyContent:'center', backgroundColor:'#f0f8ff' },
  title: { fontSize:32, fontWeight:'bold', color:'#2e7d32', marginBottom:20 },
  content: { flex:1, justifyContent:'center', alignSelf:'stretch', width:'100%' },
  text: { fontSize:18, color:'#333', marginBottom:10 },
  input: { width:'100%', borderWidth:1, borderColor:'#ccc', borderRadius:8, padding:10, marginBottom:10, backgroundColor:'#fff' },
  boton: { backgroundColor:'#2e7d32', padding:12, borderRadius:8, marginBottom:20, alignItems:'center' },
  botonTexto: { color:'#fff', fontSize:16, fontWeight:'bold' }
});
