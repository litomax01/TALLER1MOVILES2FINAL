import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase/Config';
export default function FacturacionScreen({ navigation }: any) {
  const [facturas, setFacturas] = useState<any[]>([]);
  useEffect(() => {
    const facturasRef = ref(db, 'facturas');
    const unsubscribe = onValue(facturasRef, (snapshot) => {
      const data = snapshot.val();
      const facturasArray = data
        ? Object.entries(data).map(([id, values]: any) => ({ id, ...values }))
        : [];
      setFacturas(facturasArray);
    });
    return () => unsubscribe();
  }, []);
  const totalGeneral = facturas.reduce((acc, factura) => acc + (factura.total || 0), 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Facturación</Text>

      <ScrollView style={styles.scroll}>
        {facturas.length === 0 && (
          <Text style={styles.text}>No hay facturas registradas.</Text>
        )}
        {facturas.map((factura) => (
          <View key={factura.id} style={styles.facturaCard}>
            <Text style={styles.facturaText}>
              Cliente: {factura.cliente}
            </Text>
            <Text style={styles.facturaText}>
              Fecha: {factura.fecha}
            </Text>
            <Text style={styles.facturaText}>
              Total: ${factura.total}
            </Text>
          </View>
        ))}
      </ScrollView>

      <Text style={[styles.text, {fontWeight:'bold'}]}>
        Total general: ${totalGeneral}
      </Text>

      <TouchableOpacity style={styles.boton} onPress={() => navigation.goBack()}>
        <Text style={styles.botonTexto}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20, alignItems:'center', backgroundColor:'#f0f8ff' },
  title: { fontSize:32, fontWeight:'bold', color:'#2e7d32', marginBottom:20 },
  scroll: { alignSelf:'stretch', marginBottom:20, width:'100%' },
  facturaCard: { backgroundColor:'#fff', borderRadius:10, padding:15, marginBottom:12, elevation:2 },
  facturaText: { fontSize:17, color:'#444', marginBottom:2 },
  text: { fontSize:18, color:'#333', textAlign:'center', marginVertical:15 },
  boton: { backgroundColor:'#2e7d32', padding:12, borderRadius:8, marginBottom:20, alignSelf:'center' },
  botonTexto: { color:'#fff', fontSize:16, fontWeight:'bold' }
});
