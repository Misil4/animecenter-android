import React, {useContext, useEffect, useState} from 'react';
import 'react-native-url-polyfill/auto';
import {API} from '../api';
import {
  ScrollView,
  Text,
  BackHandler,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import AppContext from '../context/appContext';

const OptionSelector = props => {
  const {theme, token} = useContext(AppContext);
  const lastIndex = props.route.params.anime.lastIndexOf(`-episodio`);
  const backAction = () => props.navigation.setOptions({headerShown: true});
  const [options, setOptions] = useState([]);
  useEffect(() => {
    props.navigation.setOptions({
      title: `Servidores`,
      headerTitleStyle: {color: theme === 'dark' ? 'white' : 'black'},
      headerStyle: {backgroundColor: theme === 'dark' ? 'black' : 'white'},
    });
    axios
      .get(
        `${API}/url/${props.route.params.anime.substring(29, lastIndex)}/${1}`,
        {
          headers: {
            Authorization: token,
          },
        },
      )
      .then(({data}) => {
        const parsedData = data.map(element =>
          element.replace(/.+\/\/|www.|\..+/g, ''),
        );
        setOptions(parsedData);
      })
      .catch(error => console.error(error));
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);
  return (
    <ScrollView
      style={{
        flex: 1,
        borderWidth: 1,
        backgroundColor: '#F5F5F5',
        flexDirection: 'column',
      }}>
      {options.length > 0 ? (
        options.map((element, index) => {
          return (
            <TouchableOpacity
              style={{
                ...styles.container,
                backgroundColor: theme === 'dark' ? 'white' : 'black',
              }}
              onPress={() =>
                props.navigation.navigate('Player', {
                  anime: props.route.params.anime,
                  episode: props.route.params.episode,
                  totalEp: props.route.params.totalEp,
                  url: index,
                })
              }>
              <Text
                style={{
                  ...styles.text,
                  color: theme === 'dark' ? 'black' : 'white',
                }}>
                {element}
              </Text>
            </TouchableOpacity>
          );
        })
      ) : (
        <ActivityIndicator  style={{backgroundColor: theme === 'dark' ? '#232322' : '#F5F5F5'}}
        size={40} />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    borderColor: 'black',
    borderWidth: 1,
    margin: 20,
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: '#232322',
    borderRadius: 20,
  },
  text: {
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'center',
  },
});

export default OptionSelector;
