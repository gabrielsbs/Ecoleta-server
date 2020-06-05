export interface Item {
  id: number
  title: string
  image_url: string
}

export interface Point {
  id: number
  image: string
  name: string
  email: string
  whatsapp: number
  latitude: number
  longitude: number
  city: string
  uf: string
  image_url: string
}

export interface UF {
  id: number
  sigla: string
  nome: string
  regiao: {
    id: number
    sigla: string
    nome: string
  }
}

export interface City {
  nome: string
}
