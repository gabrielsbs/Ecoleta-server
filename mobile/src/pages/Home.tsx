import React, { useEffect, useState } from 'react'
import { View, ImageBackground, StyleSheet, Image, Text } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { Feather as Icon } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { Dropdown, DropDownData } from 'react-native-material-dropdown'
import * as Api from '../config/api'

import { UF, City } from '../models/point.models'
import logo from '../assets/logo.png'
import homeBackground from '../assets/home-background.png'

interface HomeProps {}

const Home = ({}: HomeProps) => {
  const [ufs, setUfs] = useState<string[]>([])
  const [selectedUf, setSelectedUf] = useState<string>('0')
  const [cities, setCities] = useState<string[]>([])
  const [selectedCity, setSelectedCity] = useState<string>('0')
  const navigator = useNavigation()

  useEffect(() => {
    Api.loadUF().then(response => {
      const intials = response.data.map((uf: UF) => uf.sigla)
      setUfs(intials)
    })
  }, [])

  useEffect(() => {
    Api.loadCity(selectedUf).then(response => {
      const cities = response.data.map((city: City) => city.nome)
      setCities(cities)
    })
  }, [selectedUf])

  const handleNavigationToPoints = () => {
    navigator.navigate('Points', { uf: selectedUf, city: selectedCity })
  }

  const handleSelectedUF = (value: string) => {
    setSelectedUf(value)
  }

  const handleSelectedCity = (value: string) => {
    setSelectedCity(value)
  }

  const buildDataForPicker = (data: string[]): DropDownData[] => {
    return data.map(item => ({
      value: item
    }))
  }

  return (
    <ImageBackground style={styles.container} source={homeBackground} imageStyle={styles.backgroundImage}>
      <View style={styles.main}>
        <Image source={logo} />
        <Text style={styles.title}>Seu marketplace de coleta de resíduos.</Text>
        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
      </View>
      <Dropdown onChangeText={handleSelectedUF} label='Selecione uma UF' data={buildDataForPicker(ufs)} />
      <Dropdown onChangeText={handleSelectedCity} label='Selecione uma cidade' data={buildDataForPicker(cities)} />
      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={handleNavigationToPoints}>
          <View style={styles.buttonIcon}>
            <Icon name='arrow-right' color='#FFF' size={24} />
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32
  },

  backgroundImage: {
    width: 274,
    height: 368
  },

  main: {
    flex: 1,
    justifyContent: 'center'
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16
  }
})
