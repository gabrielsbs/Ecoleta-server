import axios from 'axios'

const ibgeURL = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados'

const api = axios.create({
  baseURL: 'http://192.168.0.53:3333'
})

const loadItems = async () => {
  return await api.get('items')
}

const loadPoints = async (items: number[], city: string, uf: string) => {
  return await api.get('points', {
    params: {
      items: items,
      city: city,
      uf: uf
    }
  })
}

const loadPoint = async (pointId: number) => {
  return await api.get(`points/${pointId}`)
}

export const loadUF = async () => {
  return await axios.create().get(`${ibgeURL}?orderBy=nome`)
}

export const loadCity = async (uf: string) => {
  return await axios.create().get(`${ibgeURL}/${uf}/municipios`)
}

export { loadItems, loadPoints, loadPoint }
