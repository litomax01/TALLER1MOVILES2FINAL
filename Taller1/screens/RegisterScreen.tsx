import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Image } from 'react-native'
import React, { useState } from 'react'
import { supabase } from '../supabase/Config'
import * as ImagePicker from 'expo-image-picker'
import { useFonts } from 'expo-font'

export default function RegisterScreen({ navigation }: any) {
  const [cedula, setCedula] = useState('')
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [fechaNacimiento, setFechaNacimiento] = useState('')
  const [correo, setCorreo] = useState('')
  const [celular, setCelular] = useState('')
  const [contrasenia, setContrasenia] = useState('')
  const [confirmarContrasenia, setConfirmarContrasenia] = useState('')
  const [tipoUsuario, setTipoUsuario] = useState('cliente')
  const [image, setImage] = useState<string | null>(null)
  const [fontsLoaded] = useFonts({
    Jarring: require('../assets/font/Jarring.otf'),
  })
  if (!fontsLoaded) return null

  async function guardar(uid: string) {
    const { error } = await supabase
      .from('usuario')
      .insert({
        id: uid,
        cedula: cedula.trim(),
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        fechaNacimiento: fechaNacimiento.trim(),
        correo: correo.trim(),
        celular: celular.trim(),
        tipoUsuario: tipoUsuario
      })
    if (error) {
      console.log("Error al guardar en Supabase:", error.message)
      Alert.alert("Error", "No se pudo guardar el usuario en la base de datos.")
    }
  }

  async function registro() {
    if (
      !cedula || !nombre || !apellido || !fechaNacimiento || !correo ||
      !celular || !contrasenia || !confirmarContrasenia
    ) {
      Alert.alert("Error", "Todos los campos son obligatorios")
      return
    }

    const email = correo.trim().replace(/^"|"$/g, '')
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Correo electrónico inválido")
      return
    }

    if (contrasenia.trim().length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres")
      return
    }

    if (contrasenia !== confirmarContrasenia) {
      Alert.alert("Error", "Las contraseñas no coinciden")
      return
    }

    if (!image) {
      Alert.alert("Imagen requerida", "Debes seleccionar una imagen de perfil.")
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: contrasenia.trim(),
    })

    if (error) {
      console.log("Error en signUp:", error.message)
      Alert.alert("Error", error.message)
      return
    }

    if (data?.user) {
      await guardar(data.user.id)
      await subir(data.user.id)
      Alert.alert("Éxito", "Usuario registrado correctamente")
      navigation.navigate('Login')
    }
  }

  const pickImage = async () => {
    if (image) {
      Alert.alert("Ya has seleccionado una imagen", "Debes eliminar la imagen actual antes de escoger otra.")
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })
    if (!result.canceled) setImage(result.assets[0].uri)
  }

  const pickImageCamera = async () => {
    if (image) {
      Alert.alert("Ya has seleccionado una imagen", "Debes eliminar la imagen actual antes de tomar una nueva.")
      return
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })
    if (!result.canceled) setImage(result.assets[0].uri)
  }

  async function subir(uid: string) {
    const avatarFile = image!
    const { data, error } = await supabase.storage
      .from('clientes')
      .upload(
        `${uid}.png`,
        { uri: avatarFile, type: 'image/png', name: `${uid}.png` } as any,
        { cacheControl: '3600', upsert: false, contentType: 'image/png' }
      )
    if (error) console.log("Error al subir imagen:", error.message)
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>¡Regístrate!</Text>
      <Text style={styles.subtitle}>Ingresa tus datos personales:</Text>

      <Text style={styles.label}>CÉDULA</Text>
      <TextInput placeholder='0102030405' style={styles.input} onChangeText={setCedula} keyboardType='numeric' />

      <Text style={styles.label}>NOMBRES</Text>
      <TextInput placeholder='Juan Carlos' style={styles.input} onChangeText={setNombre} />

      <Text style={styles.label}>APELLIDOS</Text>
      <TextInput placeholder='Pérez Díaz' style={styles.input} onChangeText={setApellido} />

      <Text style={styles.label}>FECHA NAC.</Text>
      <TextInput placeholder='YYYY-MM-DD' style={styles.input} onChangeText={setFechaNacimiento} />

      <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
      <TextInput
        placeholder='ejemplo@correo.com'
        style={styles.input}
        onChangeText={setCorreo}
        keyboardType='email-address'
        autoCapitalize='none'
      />

      <Text style={styles.label}>CELULAR</Text>
      <TextInput placeholder='09xxxxxxxx' style={styles.input} onChangeText={setCelular} keyboardType='phone-pad' />

      <Text style={styles.label}>CONTRASEÑA</Text>
      <TextInput placeholder='••••••' style={styles.input} onChangeText={setContrasenia} secureTextEntry />

      <Text style={styles.label}>CONFIRMAR CONTRASEÑA</Text>
      <TextInput placeholder='••••••' style={styles.input} onChangeText={setConfirmarContrasenia} secureTextEntry />

      <TouchableOpacity onPress={pickImage} style={styles.boton}>
        <Text style={styles.botonTexto}>Elegir galería</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={pickImageCamera} style={styles.boton}>
        <Text style={styles.botonTexto}>Tomar foto</Text>
      </TouchableOpacity>

      {image && (
        <>
          <Image source={{ uri: image }} style={styles.avatar} />
          <TouchableOpacity onPress={() => setImage(null)} style={[styles.boton, styles.delete]}>
            <Text style={styles.botonTexto}>Eliminar imagen</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity onPress={registro} style={styles.botonPrimary}>
        <Text style={styles.botonTexto}>Registrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.botonCancel}>
        <Text style={styles.botonTexto}>Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#e8f5f2',
  },
  title: {
    fontFamily: 'Jarring',
    fontSize: 34,
    fontWeight: '900',
    color: '#00695c',
    marginTop: 32,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Jarring',
    fontSize: 18,
    color: '#004d40',
    marginBottom: 24,
  },
  label: {
    width: '90%',
    fontFamily: 'Jarring',
    fontSize: 14,
    fontWeight: '700',
    color: '#004d40',
    marginVertical: 6,
    letterSpacing: 1,
  },
  input: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#00796b',
    paddingVertical: 12,
    paddingHorizontal: 18,
    fontSize: 16,
    fontFamily: 'Jarring',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  boton: {
    width: '90%',
    backgroundColor: '#00897b',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#00897b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  botonPrimary: {
    width: '90%',
    backgroundColor: '#00c4a7',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#00c4a7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  botonCancel: {
    width: '90%',
    backgroundColor: '#e53935',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#b71c1c',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 7,
    elevation: 6,
  },
  botonTexto: {
    fontFamily: 'Jarring',
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  delete: {
    backgroundColor: '#888',
    marginTop: 12,
  },
  avatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    marginTop: 20,
    borderWidth: 3,
    borderColor: '#00796b',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
})
