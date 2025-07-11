import { createStackNavigator } from "@react-navigation/stack"
import HomeScreen from "../screens/HomeScreen"
import LoginScreen from "../screens/LoginScreen"
import RegisterScreen from "../screens/RegisterScreen"
import { createDrawerNavigator } from "@react-navigation/drawer"
import { NavigationContainer } from "@react-navigation/native"
import PerfilScreen from "../screens/PerfilScreen"
import ListaPedidosScreen from "../screens/ListaPedidosScreen"
import FacturacionScreen from "../screens/FacturacionScreen"
import SoporteScreen from "../screens/SoporteScreen"
import NuevoPedidoScreen from '../screens/NuevoPedidoScreen';

const Stack = createStackNavigator()
function MyStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Drawer" component={MyDrawer} />
            <Stack.Screen name="Pedido" component={NuevoPedidoScreen} />
        </Stack.Navigator>
    )
}

const Drawer = createDrawerNavigator()
function MyDrawer() {
    return (
        <Drawer.Navigator >
            <Drawer.Screen name="Perfil" component={PerfilScreen} />
             <Drawer.Screen name="ListaPedidos" component={ListaPedidosScreen} />
              <Drawer.Screen name="Facturacion" component={FacturacionScreen} />
               <Drawer.Screen name="Soporte" component={SoporteScreen} />
               <Drawer.Screen name="NuevoPedido" component={NuevoPedidoScreen} />

        </Drawer.Navigator>
    )
}

export default function NavegadorPrincipal() {
    return (
        <NavigationContainer>
            <MyStack />
        </NavigationContainer>
    )
}