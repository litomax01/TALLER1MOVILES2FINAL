import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

export default function PerfilScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Perfil</Text>
      <View style={styles.content}>
        <Text style={styles.text}>Nombre: Juan Pérez</Text>
        <Text style={styles.text}>Email: juan@mail.com</Text>
        {}
      </View>
      <TouchableOpacity style={styles.boton} onPress={() => {}}>
        <Text style={styles.botonTexto}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20, alignItems:'center', justifyContent:'center', backgroundColor:'#f0f8ff' },
  title: { fontSize:32, fontWeight:'bold', color:'#2e7d32', marginBottom:20 },
  content: { flex:1, justifyContent:'center' },
  text: { fontSize:18, color:'#333', marginVertical:5 },
  boton: { backgroundColor:'#d32f2f', padding:12, borderRadius:8, marginBottom:20 },
  botonTexto: { color:'#fff', fontSize:16, fontWeight:'bold' }
})
