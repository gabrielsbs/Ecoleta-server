import * as React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { SvgUri } from 'react-native-svg'
import { Item } from '../models/point.models'

export interface ItemCardProps {
  item: Item
  hasBeenSelected: (id: number) => boolean
  handleItemPress: (id: number) => void
}

export function ItemCard({ item, hasBeenSelected, handleItemPress }: ItemCardProps) {
  return (
    <TouchableOpacity
      style={[styles.item, hasBeenSelected(item.id) ? styles.selectedItem : {}]}
      activeOpacity={0.6}
      onPress={() => handleItemPress(item.id)}>
      <SvgUri width={42} height={42} uri={item.image_url} />
      <Text style={styles.itemTitle}> {item.title} </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
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
