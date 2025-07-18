import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { supabase } from '../supabase/Config'
import { useFonts } from 'expo-font'

export default function LoginScreen({ navigation }: any) {
  const [correo, setCorreo] = useState('')
  const [contrasenia, setContrasenia] = useState('')
  const [loading, setLoading] = useState(false)

  const [fontsLoaded] = useFonts({
    Jarring: require('../assets/font/Jarring.otf'),
  })

  if (!fontsLoaded) {
    return <ActivityIndicator style={{ flex: 1 }} />
  }

  async function login() {
    if (!correo.trim() || !contrasenia.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos')
      return
    }

    const email = correo.trim().replace(/^"|"$/g, '')
    const password = contrasenia.trim()

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Correo electrónico inválido')
      return
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres')
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw new Error(error.message)

      const user = data.user
      if (!user) {
        Alert.alert('Error', 'No se pudo iniciar sesión')
        return
      }

      const { data: userData, error: userError } = await supabase
        .from('usuario')
        .select('tipoUsuario')
        .eq('id', user.id)
        .single()

      if (userError) throw new Error(userError.message)

      if (userData.tipoUsuario === 'cliente') {
        navigation.navigate('Drawer')
      } else {
        Alert.alert(
          'Acceso denegado',
          "Solo los usuarios con tipo 'cliente' pueden ingresar."
        )
        await supabase.auth.signOut()
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Problema de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>¡Ingresa al sistema!</Text>

      <Text style={styles.label}>Correo Electrónico:</Text>
      <TextInput
        style={styles.input}
        placeholder="ejemplo@correo.com"
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={setCorreo}
      />

      <Text style={styles.label}>Contraseña:</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        onChangeText={setContrasenia}
      />

      <TouchableOpacity
        style={[styles.boton, loading && styles.botonDisabled]}
        onPress={login}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.botonTexto}>Ingresar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botonCancelar}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.botonTextoCancelar}>Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  title: {
    fontFamily: 'Jarring',
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginVertical: 20,
  },
  label: {
    fontFamily: 'Jarring',
    alignSelf: 'flex-start',
    marginLeft: '10%',
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    width: '80%',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    fontFamily: 'Jarring',
  },
  boton: {
    backgroundColor: '#2e7d32',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 8,
    marginTop: 20,
  },
  botonDisabled: {
    opacity: 0.6,
  },
  botonTexto: {
    fontFamily: 'Jarring',
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  botonCancelar: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 8,
    marginTop: 10,
  },
  botonTextoCancelar: {
    fontFamily: 'Jarring',
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})
