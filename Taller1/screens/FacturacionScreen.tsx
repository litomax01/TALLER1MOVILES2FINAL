import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import { ref, onValue, push } from 'firebase/database';
import { db } from '../firebase/Config';
import * as Font from 'expo-font';
interface Pedido {
  id: string;
  cliente: string;
  total: number;
  [key: string]: any;
}
interface Factura {
  id: string;
  cliente: string;
  fecha: string;
  total: number;
  pedidoId: string;
}

export default function FacturacionScreen({ navigation }: { navigation: any }) {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [selectedFactura, setSelectedFactura] = useState<Factura | null>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  useEffect(() => {
    (async () => {
      await Font.loadAsync({ Jarring: require('../assets/font/Jarring.otf') });
      setFontsLoaded(true);
    })();
  }, []);

  useEffect(() => {
    const pedidosRef = ref(db, 'pedidos');
    const facturasRef = ref(db, 'facturas');

    const unsubPed = onValue(pedidosRef, snapshot => {
      const data = snapshot.val() || {};
      const list: Pedido[] = Object.entries(data).map(([id, v]) => {
        const val: any = v;
        return {
          id,
          cliente: val.cliente || '',
          total: typeof val.total === 'string' ? parseFloat(val.total) : val.total || 0,
          ...val,
        } as Pedido;
      });
      setPedidos(list);
    });

    const unsubFact = onValue(facturasRef, snapshot => {
      const data = snapshot.val() || {};
      const list: Factura[] = Object.entries(data).map(([id, v]) => {
        const val: any = v;
        return {
          id,
          cliente: val.cliente || '',
          fecha: val.fecha || '',
          total: typeof val.total === 'string' ? parseFloat(val.total) : val.total || 0,
          pedidoId: val.pedidoId || '',
        } as Factura;
      });
      setFacturas(list);
    });

    return () => { unsubPed(); unsubFact(); };
  }, []);

  const handleFacturar = (pedido: Pedido) => {
    const nueva = {
      cliente: pedido.cliente,
      fecha: new Date().toLocaleDateString(),
      total: pedido.total,
      pedidoId: pedido.id,
    };
    push(ref(db, 'facturas'), nueva);
  };

  const toggleFactura = (f: Factura) => {
    setSelectedFactura(prev => (prev?.id === f.id ? null : f));
  };

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}> 
        <ActivityIndicator size="large" />
      </View>
    );
  }
  const totalGeneral = facturas.reduce((sum, f) => sum + f.total, 0);

  return (
    <View style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}>      
      <Text style={[styles.title, isDark ? styles.darkText : styles.lightText]}>Facturación</Text>
      <ScrollView style={styles.scroll}>

        {}
        {pedidos.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isDark ? styles.darkText : styles.lightText]}>Pedidos Pendientes</Text>
            {pedidos.map(p => (
              <View key={p.id} style={[styles.card, isDark ? styles.darkCard : styles.lightCard]}>                
                <Text style={[styles.text, isDark ? styles.darkText : styles.lightText]}>Cliente: {p.cliente}</Text>
                <Text style={[styles.text, isDark ? styles.darkText : styles.lightText]}>Total: ${p.total.toFixed(2)}</Text>
                <TouchableOpacity style={styles.button} onPress={() => handleFacturar(p)}>
                  <Text style={styles.buttonText}>Generar Factura</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {}
        <Text style={[styles.sectionTitle, isDark ? styles.darkText : styles.lightText]}>Facturas Registradas</Text>
        {facturas.length === 0 ? (
          <Text style={[styles.text, isDark ? styles.darkText : styles.lightText]}>No hay facturas registradas.</Text>
        ) : (
          facturas.map(f => (
            <TouchableOpacity
              key={f.id}
              style={[styles.card, isDark ? styles.darkCard : styles.lightCard]}
              onPress={() => toggleFactura(f)}
            >
              <Text style={[styles.text, isDark ? styles.darkText : styles.lightText]}>Cliente: {f.cliente}</Text>
              <Text style={[styles.text, isDark ? styles.darkText : styles.lightText]}>Fecha: {f.fecha}</Text>
              <Text style={[styles.text, isDark ? styles.darkText : styles.lightText]}>Total: ${f.total.toFixed(2)}</Text>
            </TouchableOpacity>
          ))
        )}

        {}
        {selectedFactura && (
          <View style={[styles.detalleCard, isDark ? styles.darkCard : styles.lightCard]}>            
            <Text style={[styles.detalleText, isDark ? styles.darkText : styles.lightText]}>Pedido ID: {selectedFactura.pedidoId}</Text>
            <Text style={[styles.detalleText, isDark ? styles.darkText : styles.lightText]}>Precio base: ${selectedFactura.total.toFixed(2)}</Text>
            <Text style={[styles.detalleText, isDark ? styles.darkText : styles.lightText]}>IVA (15%): ${(selectedFactura.total * 0.15).toFixed(2)}</Text>
            <Text style={[styles.detalleText, isDark ? styles.darkText : styles.lightText]}>Total con IVA: ${(selectedFactura.total * 1.15).toFixed(2)}</Text>
          </View>
        )}

      </ScrollView>

      <Text style={[styles.totalText, isDark ? styles.darkText : styles.lightText]}>Total general: ${totalGeneral.toFixed(2)}</Text>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center' },
  lightBg: { backgroundColor: '#f0f8ff' },
  darkBg: { backgroundColor: '#121212' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 20, fontFamily: 'Jarring' },
  lightText: { color: '#2e7d32' },
  darkText: { color: '#bb86fc' },
  scroll: { width: '100%' },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 24, fontWeight: '600', marginVertical: 10, fontFamily: 'Jarring' },
  card: { borderRadius: 10, padding: 15, marginBottom: 12, elevation: 2 },
  lightCard: { backgroundColor: '#fff' },
  darkCard: { backgroundColor: '#1e1e1e' },
  text: { fontSize: 18, marginBottom: 4, fontFamily: 'Jarring' },
  button: { backgroundColor: '#2e7d32', padding: 10, borderRadius: 8, alignSelf: 'flex-start' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', fontFamily: 'Jarring' },
  detalleCard: { borderRadius: 10, padding: 15, marginVertical: 20, width: '100%', elevation: 1 },
  detalleText: { fontSize: 16, marginBottom: 4, fontFamily: 'Jarring' },
  totalText: { fontSize: 20, fontWeight: 'bold', marginVertical: 10, fontFamily: 'Jarring' },
  backButton: { backgroundColor: '#2e7d32', padding: 12, borderRadius: 8 },
  backButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', fontFamily: 'Jarring' }
});
