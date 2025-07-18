import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native'
import { ref, onValue } from 'firebase/database'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase/Config'
import { useFonts } from 'expo-font'
import * as Haptics from 'expo-haptics'
import { LinearGradient } from 'expo-linear-gradient'

export default function ListaPedidosScreen({ navigation }: any) {
  const [pedidos, setPedidos] = useState<any[]>([])
  const [fontsLoaded] = useFonts({
    Jarring: require('../assets/font/Jarring.otf'),
  })

  useEffect(() => {
    const auth = getAuth()
    const user = auth.currentUser
    if (!user) return

    const pedidosRef = ref(db, 'pedidos')
    const unsub = onValue(pedidosRef, (snap) => {
      const data = snap.val() || {}
      const arr = Object.entries(data).map(([id, vals]: any) => ({
        id,
        ...vals,
      }))
      setPedidos(arr.filter((p) => p.uid === user.uid))
    })
    return () => unsub()
  }, [])

  if (!fontsLoaded) return null

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    navigation.goBack()
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Pedidos</Text>
      <ScrollView style={styles.scroll}>
        {pedidos.length === 0 ? (
          <Text style={styles.emptyText}>No hay pedidos activos.</Text>
        ) : (
          pedidos.map((p) => (
            <View key={p.id} style={styles.card}>
              <Text style={styles.label}>Cliente</Text>
              <Text style={styles.value}>{p.cliente}</Text>
              <Text style={styles.label}>Servicio</Text>
              <Text style={styles.value}>{p.servicio}</Text>
              <Text style={styles.label}>Ubicación</Text>
              <Text style={styles.value}>{p.ubicacion}</Text>
              <Text style={styles.label}>Precio</Text>
              <Text style={styles.value}>${p.precio}</Text>
              <Text style={styles.label}>Estado</Text>
              <Text style={[styles.value, styles.status]}>
                {p.estado ?? 'Pendiente'}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity onPress={handleBack} activeOpacity={0.8}>
        <LinearGradient
          colors={['#11998e', '#38ef7d']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Volver</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0f7fa',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Jarring',
    fontWeight: '900',
    color: '#00796b',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: '#004d40',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  scroll: {
    flex: 1,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Jarring',
    color: '#555',
    textAlign: 'center',
    marginTop: 50,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Jarring',
    fontWeight: '700',
    color: '#00796b',
    marginTop: 8,
  },
  value: {
    fontSize: 18,
    fontFamily: 'Jarring',
    fontWeight: '500',
    color: '#34495e',
    marginBottom: 4,
  },
  status: {
    fontStyle: 'italic',
  },
  button: {
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: '#11998e',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Jarring',
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 1.2,
  },
})
