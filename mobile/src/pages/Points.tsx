import React, { useState, useEffect } from 'react'
import Constants from 'expo-constants'
import { Feather as Icon } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { SvgUri } from 'react-native-svg'
import { ScrollView, FlatList } from 'react-native-gesture-handler'
import * as Location from 'expo-location'

import * as Api from '../config/api'
import { Item, Point } from '../models/point.models'
import { ItemCard } from '../components/ItemCard'

interface RouteParams {
  uf: string
  city: string
}

const Points = () => {
  const [items, setItems] = useState<Item[]>([])
  const [points, setPoints] = useState<Point[]>([])
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [initalPosition, setInitialPosition] = useState<[number, number]>([0, 0])
  const navigator = useNavigation()
  const routes = useRoute()
  const params = routes.params as RouteParams

  const loadPosition = async () => {
    const { status } = await Location.requestPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Ooops', 'Precisamos dessa permissão arrombado')
    }
    const location = await Location.getCurrentPositionAsync()

    const { latitude, longitude } = location.coords
    setInitialPosition([latitude, longitude])
  }

  useEffect(() => {
    loadPosition()
  }, [])

  useEffect(() => {
    Api.loadPoints(selectedItems, params.city, params.uf).then(response => setPoints(response.data))
  }, [selectedItems])

  useEffect(() => {
    Api.loadItems().then(response => setItems(response.data))
  }, [])

  const handleMarkerPress = (id: number) => {
    navigator.navigate('Detail', { id: id })
  }

  const hasBeenSelected = (id: number) => {
    return selectedItems.includes(id)
  }

  const handleItemPress = (id: number) => {
    if (hasBeenSelected(id)) {
      const filteredItems = selectedItems.filter(item => item !== id)
      setSelectedItems(filteredItems)
    } else {
      setSelectedItems([...selectedItems, id])
    }
  }

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={navigator.goBack}>
          <Icon name='arrow-left' color='#34cb79' size={24} />
        </TouchableOpacity>

        <Text style={styles.title}>Bem Vindo.</Text>
        <Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>

        <View style={styles.mapContainer}>
          {initalPosition[0] !== 0 && (
            <MapView
              style={styles.map}
              initialRegion={{ latitude: initalPosition[0], longitude: initalPosition[1], latitudeDelta: 0.014, longitudeDelta: 0.014 }}>
              {points.map(point => (
                <Marker
                  key={String(point.id)}
                  style={styles.mapMarker}
                  onPress={() => handleMarkerPress(point.id)}
                  coordinate={{ latitude: point.latitude, longitude: point.longitude }}>
                  <View style={styles.mapMarkerContainer}>
                    <Image
                      style={styles.mapMarkerImage}
                      source={{
                        uri: point.image_url
                      }}
                    />
                    <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                  </View>
                </Marker>
              ))}
            </MapView>
          )}
        </View>
      </View>
      <View style={styles.itemsContainer}>
        <FlatList
          data={items}
          horizontal
          contentContainerStyle={styles.scrollContentContainer}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <ItemCard key={String(item.id)} item={item} hasBeenSelected={hasBeenSelected} handleItemPress={handleItemPress} />
          )}
        />
      </View>
    </>
  )
}

export default Points

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20 + Constants.statusBarHeight
  },

  title: {
    fontSize: 20,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 4,
    fontFamily: 'Roboto_400Regular'
  },

  mapContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 16
  },

  map: {
    width: '100%',
    height: '100%'
  },

  mapMarker: {
    width: 90,
    height: 80
  },

  mapMarkerContainer: {
    width: 90,
    height: 70,
    backgroundColor: '#34CB79',
    flexDirection: 'column',
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center'
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: 'cover'
  },

  mapMarkerTitle: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    color: '#FFF',
    fontSize: 13,
    lineHeight: 23
  },

  scrollContentContainer: {
    paddingHorizontal: 20
  },

  itemsContainer: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 32
  },

  item: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
    height: 120,
    width: 120,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'space-between',

    textAlign: 'center'
  },

  selectedItem: {
    borderColor: '#34CB79',
    borderWidth: 2
  },

  itemTitle: {
    fontFamily: 'Roboto_400Regular',
    textAlign: 'center',
    fontSize: 13
  }
})
