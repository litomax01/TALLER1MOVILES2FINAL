import React, { useState } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Alert
} from 'react-native'
import { supabase } from '../supabase/Config'

export default function RegisterScreen({ navigation }: any) {
  const [cedula, setCedula] = useState('')
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [fechaNacimiento, setFechaNacimiento] = useState('')
  const [correo, setCorreo] = useState('')
  const [celular, setCelular] = useState('')
  const [contrasenia, setContrasenia] = useState('')
  const [confirmarContrasenia, setConfirmarContrasenia] = useState('')

  const validarEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const validarFecha = (fecha: string) =>
    /^\d{4}-\d{2}-\d{2}$/.test(fecha)

  async function guardar() {
    // 1. Validaciones
    if (!cedula || !nombre || !apellido || !fechaNacimiento || !correo || !celular || !contrasenia || !confirmarContrasenia) {
      return Alert.alert('Error', 'Todos los campos son obligatorios.')
    }
    if (!/^\d{10}$/.test(cedula)) {
      return Alert.alert('Error', 'La cédula debe tener 10 dígitos.')
    }
    if (!validarFecha(fechaNacimiento)) {
      return Alert.alert('Error', 'La fecha debe tener formato YYYY-MM-DD.')
    }
    if (!validarEmail(correo)) {
      return Alert.alert('Error', 'Ingrese un correo válido.')
    }
    if (!/^\d{10}$/.test(celular)) {
      return Alert.alert('Error', 'El celular debe tener 10 dígitos.')
    }
    if (contrasenia.length < 6) {
      return Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres.')
    }
    if (contrasenia !== confirmarContrasenia) {
      return Alert.alert('Error', 'Las contraseñas no coinciden.')
    }

    // 2. Insert en Supabase
    const { error } = await supabase
      .from('usuario')
      .insert({
        cedula,
        nombre,
        apellido,
        fechaNacimiento,
        correo,
        celular,
        contrasenia,
        tipoUsuario: 'cliente'
      })

    if (error) {
      Alert.alert('Error', 'No se pudo registrar. Intente de nuevo.')
      console.log(error)
    } else {
      Alert.alert('Éxito', 'Usuario registrado correctamente.', [
        { text: 'OK', onPress: () => navigation.navigate('Home') }
      ])
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>¡Regístrate!</Text>
      <Text style={styles.subtitle}>Ingresa tus datos personales:</Text>

      <Text style={styles.label}>Cédula:</Text>
      <TextInput
        placeholder="Ej: 0102030405"
        style={styles.input}
        onChangeText={setCedula}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Nombres:</Text>
      <TextInput
        placeholder="Ej: Juan Carlos"
        style={styles.input}
        onChangeText={setNombre}
      />

      <Text style={styles.label}>Apellidos:</Text>
      <TextInput
        placeholder="Ej: Pérez Díaz"
        style={styles.input}
        onChangeText={setApellido}
      />

      <Text style={styles.label}>Fecha de Nacimiento:</Text>
      <TextInput
        placeholder="YYYY-MM-DD"
        style={styles.input}
        onChangeText={setFechaNacimiento}
      />

      <Text style={styles.label}>Correo Electrónico:</Text>
      <TextInput
        placeholder="ejemplo@correo.com"
        style={styles.input}
        onChangeText={setCorreo}
        keyboardType="email-address"
      />

      <Text style={styles.label}>Celular:</Text>
      <TextInput
        placeholder="09xxxxxxxx"
        style={styles.input}
        onChangeText={setCelular}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Contraseña:</Text>
      <TextInput
        placeholder=""
        style={styles.input}
        onChangeText={setContrasenia}
        secureTextEntry
      />

      <Text style={styles.label}>Confirmar Contraseña:</Text>
      <TextInput
        placeholder=""
        style={styles.input}
        onChangeText={setConfirmarContrasenia}
        secureTextEntry
      />

      <TouchableOpacity style={styles.boton} onPress={guardar}>
        <Text style={styles.botonTexto}>Registrar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botonCancelar} onPress={() => navigation.navigate('Home')}>
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
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20
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
    backgroundColor: '#fff',
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
