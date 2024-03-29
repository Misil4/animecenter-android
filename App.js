/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Anime from './screens/anime';
import Search from './screens/search';
import SplashScreen from 'react-native-splash-screen';
import Player from './screens/reproductor';
import Home from './screens/home';
import AppContext from './context/appContext';
import {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OptionSelector from './screens/option';
import Login from './screens/login';
import { styles } from './styles/styles';

const Stack = createNativeStackNavigator();

const App = () => {
  const [theme, setTheme] = useState('light');
  const [token, setToken] = useState('');
  const [login, setLogin] = useState(false);
  const [lista, setLista] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  useEffect(() => {
    AsyncStorage.getItem('lista').then(value => {
      const parsedValue = JSON.parse(value);

      if (parsedValue && parsedValue !== null && parsedValue["lista"] !== null) {
        return parsedValue["lista"];
      } else {
        return [];
      }
    }),
      AsyncStorage.getItem('theme').then(
        value => value !== null && setTheme(value),
      );
    SplashScreen.hide();
  }, []);
  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        token,
        setToken,
        userInfo,
        setUserInfo,
        login,
        setLogin,
        lista,
        setLista,
      }}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            contentStyle: {
              backgroundColor: theme === 'dark' ? '#232322' : '#F5F5F5',
            },
          }}>
          <Stack.Screen name="Login" component={Login}></Stack.Screen>
          <Stack.Screen name="Home" component={Home}></Stack.Screen>
          <Stack.Screen name="Search" component={Search}></Stack.Screen>
          <Stack.Screen
            name="OptionSelector"
            component={OptionSelector}></Stack.Screen>
          <Stack.Screen name="Player" component={Player}></Stack.Screen>
          <Stack.Screen name="Anime" component={Anime}></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </AppContext.Provider>
  );
};

export default App;
