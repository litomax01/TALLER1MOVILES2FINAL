import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, Image, TextInput, ScrollView, Alert, Animated } from 'react-native'
import { supabase } from '../supabase/Config'
import * as ImagePicker from 'expo-image-picker'
import { MaterialIcons } from '@expo/vector-icons'
import { Audio } from 'expo-av'
import * as Font from 'expo-font'

export default function PerfilScreen({ navigation }: any) {
  const [uid, setuid] = useState('')
  const [nombre, setnombre] = useState('')
  const [apellido, setapellido] = useState('')
  const [fechaNacimiento, setfechaNacimiento] = useState('')
  const [correo, setcorreo] = useState('')
  const [celular, setcelular] = useState('')
  const [tipoUsuario, settipoUsuario] = useState('')
  const [imagen, setImagen] = useState('')
  const [editando, setEditando] = useState(false)
  const [sound, setSound] = useState<Audio.Sound | null>(null)
  const imageOpacity = useState(new Animated.Value(0))[0]
  const [fontsLoaded, setFontsLoaded] = useState(false)


  useEffect(() => {
    Font.loadAsync({
      'Jarring': require('../assets/font/Jarring.otf'), 
    }).then(() => setFontsLoaded(true))
  }, [])

  const urlImagenPublica = (userId: string) =>
    `https://zzwvempvarmirffbxoqa.supabase.co/storage/v1/object/public/clientes/${userId}.png?${Date.now()}`

  const leerUsuario = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const uid = user.id
      setuid(uid)
      const { data } = await supabase.from('usuario').select('*').eq('id', uid)
      if (data && data.length > 0) {
        setnombre(data[0].nombre)
        setapellido(data[0].apellido)
        setfechaNacimiento(data[0].fechaNacimiento)
        setcorreo(data[0].correo)
        setcelular(data[0].celular)
        settipoUsuario(data[0].tipoUsuario)
        setImagen(urlImagenPublica(uid))
        Animated.timing(imageOpacity, { toValue: 1, duration: 600, useNativeDriver: true }).start()
      }
    }
  }

  useEffect(() => {
    if (fontsLoaded) leerUsuario()
    return () => {
      if (sound) sound.unloadAsync()
    }
  }, [fontsLoaded])

  const subirImagen = async (uri: string) => {
    try {
      const response = await fetch(uri)
      const blob = await response.blob()
      const { error } = await supabase.storage
        .from('clientes')
        .upload(`${uid}.png`, blob, {
          cacheControl: '3600',
          upsert: true,
        })
      if (error) {
        Alert.alert('Error', 'No se pudo subir la imagen.')
        return false
      }
      setImagen(urlImagenPublica(uid))
      Animated.timing(imageOpacity, { toValue: 1, duration: 500, useNativeDriver: true }).start()
      return true
    } catch {
      Alert.alert('Error', 'Ocurrió un problema al procesar la imagen.')
      return false
    }
  }

  const seleccionarImagen = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      aspect: [1, 1],
    })
    if (!result.canceled && result.assets.length > 0) {
      const file = result.assets[0]
      const success = await subirImagen(file.uri)
      if (success) Alert.alert('Éxito', 'Imagen actualizada.')
    }
  }

  const tomarFoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
      aspect: [1, 1],
    })
    if (!result.canceled && result.assets.length > 0) {
      const file = result.assets[0]
      const success = await subirImagen(file.uri)
      if (success) Alert.alert('Éxito', 'Imagen actualizada.')
    }
  }

  const cambiarImagen = () => {
    Alert.alert('Cambiar imagen', 'Selecciona una opción', [
      { text: 'Cámara', onPress: tomarFoto },
      { text: 'Galería', onPress: seleccionarImagen },
      { text: 'Cancelar', style: 'cancel' }
    ])
  }

  const playSuccessSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/success.mp3')
      )
      setSound(sound)
      await sound.playAsync()
    } catch {}
  }

  const guardarCambios = async () => {
    const { error } = await supabase
      .from('usuario')
      .update({
        nombre,
        apellido,
        fechaNacimiento,
        celular,
      })
      .eq('id', uid)
    if (error) {
      Alert.alert('Error', 'No se pudo guardar los cambios.')
    } else {
      await playSuccessSound()
      Alert.alert('Éxito', 'Cambios guardados correctamente.')
      setEditando(false)
    }
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) navigation.navigate('Home')
  }

  if (!fontsLoaded) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Cargando fuente...</Text></View>
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.header}>
        <Text style={[styles.title, { fontFamily: 'Jarring' }]}>Perfil</Text>
        <TouchableOpacity onPress={() => setEditando(!editando)}>
          <MaterialIcons name="edit" size={30} color={editando ? "#e67e22" : "#27ae60"} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={editando ? cambiarImagen : undefined}>
        <Animated.View style={{ opacity: imageOpacity }}>
          {imagen
            ? <Image style={styles.image} source={{ uri: imagen }} />
            : <View style={styles.iconCircle}>
                <MaterialIcons name="person" size={120} color="#bbb" />
              </View>
          }
        </Animated.View>
      </TouchableOpacity>
      <View style={styles.infoContainer}>
        <TextInput
          style={[styles.text, editando && styles.inputEditable, { fontFamily: 'Jarring' }]}
          editable={editando}
          value={nombre}
          onChangeText={setnombre}
          placeholder="Nombre"
          placeholderTextColor="#999"
        />
        <TextInput
          style={[styles.text, editando && styles.inputEditable, { fontFamily: 'Jarring' }]}
          editable={editando}
          value={apellido}
          onChangeText={setapellido}
          placeholder="Apellido"
          placeholderTextColor="#999"
        />
        <TextInput
          style={[styles.text, editando && styles.inputEditable, { fontFamily: 'Jarring' }]}
          editable={editando}
          value={fechaNacimiento}
          onChangeText={setfechaNacimiento}
          placeholder="Fecha de nacimiento"
          placeholderTextColor="#999"
        />
        <TextInput
          style={[styles.text, { fontFamily: 'Jarring' }]}
          editable={false}
          value={correo}
          placeholder="Correo"
          placeholderTextColor="#999"
        />
        <TextInput
          style={[styles.text, editando && styles.inputEditable, { fontFamily: 'Jarring' }]}
          editable={editando}
          value={celular}
          onChangeText={setcelular}
          placeholder="Celular"
          placeholderTextColor="#999"
        />
        <TextInput
          style={[styles.text, { fontFamily: 'Jarring' }]}
          editable={false}
          value={tipoUsuario}
          placeholder="Tipo de usuario"
          placeholderTextColor="#999"
        />
      </View>
      {editando && (
        <TouchableOpacity onPress={guardarCambios} style={styles.buttonSave} activeOpacity={0.8}>
          <Text style={[styles.textButton, { fontFamily: 'Jarring' }]}>Guardar</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={logout} style={styles.buttonLogout} activeOpacity={0.8}>
        <Text style={[styles.textButton, { fontFamily: 'Jarring' }]}>Cerrar sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: '#e7f8f4',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#27ae60',
    letterSpacing: 1.2,
  },
  infoContainer: {
    width: '100%',
    marginBottom: 30,
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 15,
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 5,
  },
  inputEditable: {
    borderColor: '#27ae60',
    borderWidth: 2,
    backgroundColor: '#e8f5e9',
  },
  buttonSave: {
    backgroundColor: '#27ae60',
    paddingVertical: 16,
    paddingHorizontal: 80,
    borderRadius: 30,
    marginBottom: 20,
    shadowColor: '#1b5e20',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonLogout: {
    backgroundColor: '#e74c3c',
    paddingVertical: 16,
    paddingHorizontal: 80,
    borderRadius: 30,
    shadowColor: '#c0392b',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  textButton: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 1,
  },
  image: {
    width: 220,
    height: 220,
    borderRadius: 110,
    marginBottom: 25,
    borderWidth: 3,
    borderColor: '#27ae60',
    backgroundColor: '#fff',
  },
  iconCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    marginBottom: 25,
    borderWidth: 3,
    borderColor: '#bbb',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
