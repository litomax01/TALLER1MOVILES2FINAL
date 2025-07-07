import React, { useState } from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert
} from 'react-native'
import { supabase } from '../supabase/Config'

export default function LoginScreen({ navigation }: any) {
  const [correo, setCorreo] = useState('')
  const [contrasenia, setContrasenia] = useState('')

  async function handleLogin() {
    if (!correo || !contrasenia) {
      return Alert.alert('Error', 'Por favor ingresa correo y contraseña.')
    }

    const { data: user, error } = await supabase
      .from('usuario')
      .select('*')
      .eq('correo', correo)
      .eq('contrasenia', contrasenia)
      .single()

    if (error || !user) {
      return Alert.alert('Error', 'Credenciales inválidas o usuario no registrado.')
    }
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Drawer',
          params: { user }
        }
      ]
    })
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>¡Ingresa al sistema!</Text>

      <Text style={styles.label}>Correo Electrónico:</Text>
      <TextInput
        placeholder="ejemplo@correo.com"
        style={styles.input}
        onChangeText={setCorreo}
        keyboardType="email-address"
        autoCapitalize="none"
        value={correo}
      />

      <Text style={styles.label}>Contraseña:</Text>
      <TextInput
        placeholder=""
        style={styles.input}
        onChangeText={setContrasenia}
        secureTextEntry
        value={contrasenia}
      />

      <TouchableOpacity style={styles.boton} onPress={handleLogin}>
        <Text style={styles.botonTexto}>Ingresar</Text>
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
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    flexGrow: 1
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 5,
    marginTop: 20
  },
  label: {
    alignSelf: 'flex-start',
    marginLeft: '10%',
    marginTop: 10,
    fontWeight: 'bold',
    color: '#333'
  },
  input: {
    width: '80%',
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10
  },
  boton: {
    backgroundColor: '#2e7d32',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 8,
    marginTop: 20
  },
  botonTexto: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center'
  },
  botonCancelar: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 8,
    marginTop: 10
  },
  botonTextoCancelar: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }
})
