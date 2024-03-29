import React, {useContext, useEffect, useState} from 'react';
import {View, ScrollView, ActivityIndicator} from 'react-native';
import axios from 'axios';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Image, ListItem} from '@rneui/themed';
import Carousel from 'react-native-reanimated-carousel';
import {API} from '../api';
import AppContext from '../context/appContext';
import {Tab, Text, TabView, Switch} from '@rneui/themed';
import {addFollowAnime, deleteAnimeFromList} from '../helpers/followFunctions';
import Icon from 'react-native-vector-icons/AntDesign';
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from 'react-native-alert-notification';

const Series = props => {
  const [index, setIndex] = useState(0);
  const [series, setSeries] = useState([]);
  const [currentSeries, setCurrentSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [switchValue, setSwitchValue] = useState(false);
  const {theme, token, lista, setLista} = useContext(AppContext);
  useEffect(() => {
    props.navigation.setOptions({
      headerShown: false,
      headerStyle: {backgroundColor: 'red'},
    });
    axios
      .get(`${API}/lastCurrentSeries`, {
        headers: {
          Authorization: token,
        },
      })
      .then(({data}) => {
        setCurrentSeries(data);
        setLoading(false);
      });
    axios
      .get(`${API}/lastAnimeSeries`, {
        headers: {
          Authorization: token,
        },
      })
      .then(({data}) => {
        setSeries(data);
        setLoading(false);
      })
      .catch(error => console.error(error));
  }, []);

  return loading ? (
    <>
      <ActivityIndicator
        style={{backgroundColor: theme === 'dark' ? 'black' : 'white'}}
        size={40}
      />
    </>
  ) : (
    <AlertNotificationRoot>
      <SafeAreaProvider>
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme === 'dark' ? '#232322' : '#F5F5F5'
          }}>
          <Text style={{color: theme === 'dark' ? '#F5F5F5' : '#232322'}}>Portada - Lista</Text>
          <Switch
          color={theme === 'dark' ? '#F5F5F5' : '#232322'}
            value={switchValue}
            onChange={() => setSwitchValue(switchValue ? false : true)}
          />
        </View>
        <Tab
          style={{backgroundColor: theme === 'dark' ? 'black' : 'white'}}
          value={index}
          onChange={e => setIndex(e)}
          indicatorStyle={{
            backgroundColor: theme === 'dark' ? 'white' : 'black',
            height: 1,
          }}
          variant="">
          <Tab.Item
            title="Proximamente"
            titleStyle={{
              fontSize: 12,
              color: theme === 'dark' ? 'white' : 'black',
            }}
          />
          <Tab.Item
            title="En emision"
            titleStyle={{
              fontSize: 12,
              color: theme === 'dark' ? 'white' : 'black',
            }}
          />
        </Tab>
        <TabView value={index} onChange={setIndex} animationType="spring">
          <TabView.Item
            style={{
              backgroundColor: theme === 'dark' ? 'black' : 'white',
              width: '100%',
            }}>
            <View
              style={{
                flex: 1,
                backgroundColor: theme === 'dark' ? 'black' : 'white',
              }}>
              {switchValue ? (
                <ScrollView>
                  {series.map((serie, i) => (
                    <ListItem
                      containerStyle={{
                        backgroundColor: theme === 'dark' ? 'black' : 'white',
                      }}
                      key={i}
                      bottomDivider>
                      <Image
                        source={{uri: serie.image}}
                        style={{width: 100, height: 100}}
                        onPress={() =>
                          props.navigation.navigate('Anime', {
                            anime: serie.url,
                            episode: serie.episode,
                            name: serie.name,
                            imagen: serie.image,
                          })
                        }
                      />
                      <ListItem.Content
                        style={{
                          backgroundColor: theme === 'dark' ? 'black' : 'white',
                        }}>
                        <ListItem.Title
                          style={{color: theme === 'dark' ? 'white' : 'black'}}>
                          {serie.name}
                        </ListItem.Title>
                        <ListItem.Subtitle
                          style={{color: theme === 'dark' ? 'white' : 'black'}}>
                          {serie.type}
                        </ListItem.Subtitle>
                        <ListItem.Subtitle
                          style={{color: theme === 'dark' ? 'white' : 'black'}}>
                          {serie.estado}
                        </ListItem.Subtitle>
                      </ListItem.Content>
                    </ListItem>
                  ))}
                </ScrollView>
              ) : (
                <Carousel
                  loop
                  width={600}
                  autoPlay={true}
                  data={[...series.keys()]}
                  scrollAnimationDuration={1000}
                  renderItem={({index}) => (
                    <ScrollView style={{}}>
                      <Text
                        style={{
                          padding: 10,
                          width: '60%',
                          fontSize: 20,
                          textAlign: 'justify',
                          color: theme === 'dark' ? 'white' : 'black',
                        }}>
                        {series[index].name}
                      </Text>
                      <Image
                        source={{uri: series[index].image}}
                        style={{
                          alignSelf: 'center',
                          height: 450,
                          width: '100%',
                        }}
                      />
                    </ScrollView>
                  )}
                />
              )}
            </View>
          </TabView.Item>
          <TabView.Item
            style={{
              backgroundColor: theme === 'dark' ? 'black' : 'white',
              width: '100%',
            }}>
            {switchValue ? (
              <ScrollView>
                {currentSeries.map((serie, i) => (
                  <ListItem
                    containerStyle={{
                      backgroundColor: theme === 'dark' ? 'black' : 'white',
                    }}
                    key={i}
                    bottomDivider>
                    <Image
                      source={{uri: serie.image}}
                      style={{width: 100, height: 100}}
                      onPress={() => {
                        props.navigation.navigate('Anime', {
                          anime: `${serie.url}1/`,
                          name: serie.name,
                          imagen: serie.image,
                        });
                      }}
                    />
                    <ListItem.Content
                      style={{
                        backgroundColor: theme === 'dark' ? 'black' : 'white',
                      }}>
                      <ListItem.Title
                        style={{color: theme === 'dark' ? 'white' : 'black'}}>
                        {serie.name}
                      </ListItem.Title>
                      <ListItem.Subtitle
                        style={{color: theme === 'dark' ? 'white' : 'black'}}>
                        {serie.type}
                      </ListItem.Subtitle>
                      <ListItem.Subtitle
                        style={{color: theme === 'dark' ? 'white' : 'black'}}>
                        {serie.estado}
                      </ListItem.Subtitle>
                    </ListItem.Content>
                    {lista.length >0 && lista.find(item => item.name === serie.name) ? (
                      <Icon
                        name="minuscircleo"
                        color={ theme === 'dark' ? '#F5F5F5' : '#232322'}
                        size={25}
                        onPress={() => {
                          Toast.show({
                            type: ALERT_TYPE.SUCCESS,
                            title: 'Anime eliminado de tu lista',
                            textBody: 'El anime ha sido eliminado de tu lista correctamente',
                            button: 'Cerrar',
                          })
                          deleteAnimeFromList(serie.name, setLista, lista);
                        }}
                      />
                    ) : (
                      <Icon
                      color={ theme === 'dark' ? '#F5F5F5' : '#232322'}
                        name="pluscircleo"
                        size={25}
                        onPress={() => {
                          Toast.show({
                            type: ALERT_TYPE.SUCCESS,
                            title: 'Anime agregado a tu lista',
                            textBody: 'El anime ha sido agregado a tu lista correctamente',
                            button: 'Cerrar',
                          })
                          addFollowAnime(serie, setLista, lista);
                        }}
                      />
                    )}
                  </ListItem>
                ))}
              </ScrollView>
            ) : (
              <Carousel
                loop
                width={600}
                autoPlay={true}
                data={[...currentSeries.keys()]}
                scrollAnimationDuration={1000}
                renderItem={({index}) => (
                  <ScrollView style={{}}>
                    <Text
                      style={{
                        padding: 10,
                        width: '60%',
                        fontSize: 20,
                        textAlign: 'justify',
                        color: theme === 'dark' ? 'white' : 'black',
                      }}>
                      {currentSeries[index].name}
                    </Text>
                    <Image
                      onPress={() =>
                        props.navigation.navigate('Anime', {
                          anime: `${currentSeries[index].url}1/`,
                          name: currentSeries[index].name,
                          imagen: currentSeries[index].image,
                        })
                      }
                      source={{uri: currentSeries[index].image}}
                      style={{alignSelf: 'center', height: 450, width: '100%'}}
                    />
                  </ScrollView>
                )}
              />
            )}
          </TabView.Item>
        </TabView>
      </SafeAreaProvider>
    </AlertNotificationRoot>
  );
};

export default Series;
