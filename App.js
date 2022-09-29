/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import type {Node} from 'react';
import {
  Button,
  SafeAreaView,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */
const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const [isVisible, setIsVisible] = useState('true')
  const [tatuajes, setTatto] = useState([])

  useEffect(() => {
    getTatto()
  }, [])

  const getTatto = () => {

    firestore()
    .collection('tatuajes')
    .get()
    .then(async (TatuFire)=> {
      let tempTatto = []
      let promesaImagen = []
      TatuFire.forEach(TatuFire =>{
        tempTatto.push(TatuFire.data())
        promesaImagen.push(storage().ref(TatuFire.data().imagen).getDownloadURL())
        console.log('tatuajes', TatuFire.data())
      })
      const resultPromesa = await Promise.all(promesaImagen)
      
      //console.log("resultado de Promesa Imagen", resultPromesa)
      //insertado de imagen
      resultPromesa.forEach((url, index) =>{
        tempTatto[index].imagen = url
      })

      setTatto(tempTatto)
    })

  }

  const ItemTatto = ({item}) =>{
    console.log("item", item)
    return(
      <View style={styles.ContainerItem}>
        {/* No quiere cargar la imagen */}
        <Image source={{uri: item.imagen}} style={{width: 75, height: 75}}/> 
        <Text style={styles.ItemTattoName}>{item.tamaño}</Text>
        <Text style={styles.ItemTattoPrice}>{item.precio} Bs.</Text>
      </View>
    )
  }

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={{flex: 1, height: '100%'}}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <FlatList
      data={tatuajes}
      renderItem={ItemTatto}
      />  

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  ContainerItem: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
    margin: 10,
    elevation: 5,
    borderRadius: 5,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  ItemTattoName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000'
  },
  ItemTattoPrice: {
    fontWeight: 'bold',
    fontSize: 15
  }
});

export default App;
