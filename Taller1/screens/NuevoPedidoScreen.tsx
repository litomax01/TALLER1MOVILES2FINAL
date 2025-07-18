import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native'
import { ref, push, set } from 'firebase/database'
import { db } from '../firebase/Config'
import { useFonts } from 'expo-font'
import { Audio } from 'expo-av'
import * as Haptics from 'expo-haptics'
import { LinearGradient } from 'expo-linear-gradient'

export default function NuevoPedidoScreen({ navigation }: any) {
  const [cliente, setCliente] = useState('')
  const [servicio, setServicio] = useState('')
  const [ubicacion, setUbicacion] = useState('')
  const [precio, setPrecio] = useState('')

  const [sound, setSound] = useState<Audio.Sound | null>(null)
  const [fontsLoaded] = useFonts({
    Jarring: require('../assets/font/Jarring.otf'),
  })

 
  useEffect(() => {
    return () => {
      if (sound) sound.unloadAsync()
    }
  }, [sound])

  const playSuccess = async () => {
    try {
      const { sound: snd } = await Audio.Sound.createAsync(
        require('../assets/success.mp3')
      )
      setSound(snd)
      await snd.playAsync()
    } catch {
    }
  }

  const guardarPedido = async () => {
    if (!cliente || !servicio || !ubicacion || !precio) {
      Alert.alert('Error', 'Todos los campos son obligatorios.')
      return
    }

    try {
      const pedidosRef = ref(db, 'pedidos')
      const nuevoRef = push(pedidosRef)
      await set(nuevoRef, {
        uid: 'ANONIMO', 
        cliente,
        servicio,
        ubicacion,
        precio: parseFloat(precio),
        estado: 'Pendiente',
      })

      // Feedback
      await playSuccess()
      Haptics.selectionAsync()
      Alert.alert('¡Pedido enviado!', 'Gracias por confiar en nosotros.')
      navigation.goBack()
    } catch (e) {
      Alert.alert('Error', 'No se pudo enviar el pedido.')
      console.error(e)
    }
  }

  if (!fontsLoaded) {
    return null // O un indicador de carga
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Nuevo Pedido</Text>

      <TextInput
        style={styles.input}
        placeholder="Cliente"
        placeholderTextColor="#999"
        value={cliente}
        onChangeText={setCliente}
      />
      <TextInput
        style={styles.input}
        placeholder="Servicio"
        placeholderTextColor="#999"
        value={servicio}
        onChangeText={setServicio}
      />
      <TextInput
        style={styles.input}
        placeholder="Ubicación"
        placeholderTextColor="#999"
        value={ubicacion}
        onChangeText={setUbicacion}
      />
      <TextInput
        style={styles.input}
        placeholder="Precio"
        placeholderTextColor="#999"
        value={precio}
        onChangeText={setPrecio}
        keyboardType="decimal-pad"
      />

      <TouchableOpacity onPress={guardarPedido} activeOpacity={0.8}>
        <LinearGradient
          colors={['#11998e', '#38ef7d']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Enviar Pedido</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#e0f7fa',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Jarring',
    fontSize: 32,
    fontWeight: '900',
    color: '#00796b',
    textAlign: 'center',
    marginBottom: 30,
    textShadowColor: '#004d40',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#00796b',
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 15,
    fontSize: 18,
    fontFamily: 'Jarring',
    shadowColor: '#00796b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: '#11998e',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Jarring',
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
})
