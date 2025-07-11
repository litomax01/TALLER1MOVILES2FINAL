import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

export default function ListaPedidosScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pedidos</Text>
      {}
      <View style={styles.content}>
        <Text style={styles.text}>Pedidos activos y su estado.</Text>
      </View>
      <TouchableOpacity style={styles.boton} onPress={() => navigation.goBack()}>
        <Text style={styles.botonTexto}>Volver</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20, alignItems:'center', justifyContent:'center', backgroundColor:'#f0f8ff' },
  title: { fontSize:32, fontWeight:'bold', color:'#2e7d32', marginBottom:20 },
  content: { flex:1, justifyContent:'center' },
  text: { fontSize:18, color:'#333' },
  boton: { backgroundColor:'#2e7d32', padding:12, borderRadius:8, marginBottom:20 },
  botonTexto: { color:'#fff', fontSize:16, fontWeight:'bold' }
})
