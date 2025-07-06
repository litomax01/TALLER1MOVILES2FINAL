import { createStackNavigator } from "@react-navigation/stack"
import HomeScreen from "../screens/HomeScreen"
import LoginScreen from "../screens/LoginScreen"
import RegisterScreen from "../screens/RegisterScreen"
import { createDrawerNavigator } from "@react-navigation/drawer"
import { NavigationContainer } from "@react-navigation/native"

const Stack = createStackNavigator()
function MyStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Drawer" component={MyDrawer} />
        </Stack.Navigator>
    )
}

const Drawer = createDrawerNavigator()
function MyDrawer() {
    return (
        <Drawer.Navigator >
            <Drawer.Screen name="Register" component={RegisterScreen} />
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