import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native';
import { ref, push, set } from 'firebase/database';
import { db } from '../firebase/Config';
import { useFonts } from 'expo-font';

export default function SoporteScreen({ navigation }: any) {
  const [fontsLoaded] = useFonts({
    Jarring: require('../assets/font/Jarring.otf'),
  });
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);

  if (!fontsLoaded) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  const enviarSoporte = async () => {
    const nombreTrim = nombre.trim();
    const mensajeTrim = mensaje.trim();

    if (!nombreTrim || !mensajeTrim) {
      Alert.alert('Error', 'Por favor, llena todos los campos.');
      return;
    }

    setLoading(true);
    try {
      const soporteRef = ref(db, 'soporte');
      const nuevoSoporteRef = push(soporteRef);
      await set(nuevoSoporteRef, {
        nombre: nombreTrim,
        mensaje: mensajeTrim,
        fecha: new Date().toISOString(),
      });
      Alert.alert('¡Mensaje enviado!', 'Te responderemos pronto.');
      setNombre('');
      setMensaje('');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Hubo un problema al enviar el mensaje.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Soporte</Text>
      <View style={styles.content}>
        <Text style={styles.label}>¿En qué podemos ayudarte?</Text>
        <TextInput
          style={styles.input}
          placeholder="Tu nombre"
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Describe tu problema o consulta"
          value={mensaje}
          onChangeText={setMensaje}
          multiline
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={enviarSoporte}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Enviar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonTextSecondary}>Volver</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Jarring',
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 20,
  },
  content: {
    width: '100%',
  },
  label: {
    fontFamily: 'Jarring',
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
  input: {
    fontFamily: 'Jarring',
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#2e7d32',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontFamily: 'Jarring',
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonSecondary: {
    backgroundColor: '#bbb',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonTextSecondary: {
    fontFamily: 'Jarring',
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
