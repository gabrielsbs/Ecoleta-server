import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Image, SafeAreaView, Linking } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Feather as Icon, FontAwesome as FaIcon } from '@expo/vector-icons'
import * as MailComposer from 'expo-mail-composer'
import { useNavigation, useRoute } from '@react-navigation/native'
import { RectButton } from 'react-native-gesture-handler'
import Constants from 'expo-constants'
import * as Api from '../config/api'
import { Point, Item } from '../models/point.models'

export interface DetailProps {}

interface RouteParams {
  id: number
}

interface PointInfo {
  point: Point
  items: Item[]
}

const Detail = (props: DetailProps) => {
  const navigator = useNavigation()
  const routes = useRoute()
  const params = routes.params as RouteParams

  const [pointInfo, setPointInfo] = useState<PointInfo>({} as PointInfo)

  useEffect(() => {
    Api.loadPoint(params.id).then(response => setPointInfo(response.data))
  }, [])

  if (!pointInfo.point) {
    return null
  }

  const handleWhatsapp = () => {
    Linking.openURL(`whatsapp://send?phone=${pointInfo.point.whatsapp}&text=Tenho Interesse na coleta de resíduos`)
  }

  const handleComposeMail = () => {
    MailComposer.composeAsync({
      subject: 'Interesse na coleta de resíduos',
      recipients: [pointInfo.point.email]
    })
  }
  console.log(pointInfo.point.image_url)
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={navigator.goBack}>
          <Icon name='arrow-left' color='#34cb79' size={24} />
        </TouchableOpacity>
        <Image
          style={styles.pointImage}
          source={{
            uri: pointInfo.point.image_url
          }}
        />
        <Text style={styles.pointName}>{pointInfo.point.name}</Text>
        <Text style={styles.pointItems}>{pointInfo.items.map(item => item.title).join(', ')}</Text>

        <View style={styles.address}>
          <Text style={styles.addressTitle}>Endereço</Text>
          <Text style={styles.addressContent}>
            {pointInfo.point.city}, {pointInfo.point.uf}
          </Text>
        </View>
      </View>
      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={handleWhatsapp}>
          <FaIcon name='whatsapp' color='#FFF' size={20} />
          <Text style={styles.buttonText}>Whatsapp</Text>
        </RectButton>
        <RectButton style={styles.button} onPress={handleComposeMail}>
          <Icon name='mail' color='#FFF' size={20} />
          <Text style={styles.buttonText}>Email</Text>
        </RectButton>
      </View>
    </SafeAreaView>
  )
}

export default Detail

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    paddingTop: 20 + Constants.statusBarHeight
  },

  pointImage: {
    width: '100%',
    height: 215,
    resizeMode: 'cover',
    borderRadius: 10,
    marginTop: 32
  },

  pointName: {
    color: '#322153',
    fontSize: 28,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24
  },

  pointItems: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  address: {
    marginTop: 32
  },

  addressTitle: {
    color: '#322153',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16
  },

  addressContent: {
    fontFamily: 'Roboto_400Regular',
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    paddingVertical: 20,
    paddingHorizontal: 32,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  button: {
    width: '48%',
    backgroundColor: '#34CB79',
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    marginLeft: 8,
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium'
  }
})
