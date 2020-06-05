import { Request, Response } from 'express'
import knex from '../database/connection'
import { Point } from '../models'

class PointController {
  async create(request: Request, response: Response) {
    const { name, email, whatsapp, latitude, longitude, city, uf, items } = request.body as Point

    const existentItems = await knex('items').select('id')
    const itemArray = items.split(',').map(item => Number(item.trim()))
    itemArray.map(itemId => {
      if (existentItems.find(item => item.id === itemId) === undefined) {
        return response.json({ sucess: false })
      }
    })

    const trx = await knex.transaction()
    try {
      const insertedIds = await trx('points').insert({
        image: request.file.filename,
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf
      })
      const point_id = insertedIds[0]
      const pointItems = itemArray.map((item_id: number) => {
        return {
          item_id,
          point_id
        }
      })

      await trx('point_item').insert(pointItems)
      await trx.commit()
    } catch (e) {
      console.log(e)
      await trx.rollback()
      return response.json({ sucess: false })
    }
    return response.json({ sucess: true })
  }

  async show(request: Request, response: Response) {
    const { id } = request.params
    const point = await knex('points').where('id', id).first()
    if (!point) {
      return response.json({ message: 'Point not found' })
    }

    const serializedPoint = {
      ...point,
      image_url: `http://192.168.0.53:3333/uploads/${point.image}`
    }

    const items = await knex('items').join('point_item', 'items.id', '=', 'point_item.item_id').where('point_item.point_id', '=', id)

    return response.json({ point: serializedPoint, items })
  }

  async index(request: Request, response: Response) {
    const { city, uf, items } = request.query

    try {
      const parsedItems = String(items)
        .split(',')
        .map(item => Number(item.trim()))

      const points = await knex('points')
        .join('point_item', 'points.id', '=', 'point_item.point_id')
        .whereIn('point_item.item_id', parsedItems)
        .where('city', String(city))
        .where('uf', String(uf))
        .distinct()
        .select('points.*')

      const serializedPoints = points.map(point => {
        return {
          ...point,
          image_url: `http://192.168.0.53:3333/uploads/${point.image}`
        }
      })

      return response.json(serializedPoints)
    } catch (e) {
      console.log(e)
    }
  }
}

export default PointController
