import { Request, Response } from 'express'
import knex from '../database/connection'

class PointController {
  async create(request: Request, response: Response) {
    const { name, email, whatsapp, latitude, longitude, city, uf, items } = request.body

    const existentItems = await knex('items').select('id')
    items.map(itemId => {
      if (existentItems.find(item => item.id === itemId) === undefined) {
        return response.json({ sucess: false })
      }
    })

    const trx = await knex.transaction()
    try {
      const insertedIds = await trx('points').insert({
        image:
          'https://images.unsplash.com/photo-1556767576-5ec41e3239ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf
      })
      const point_id = insertedIds[0]
      const pointItems = items.map((item_id: number) => {
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

    const items = await knex('items').join('point_item', 'items.id', '=', 'point_item.item_id').where('point_item.point_id', '=', id)

    return response.json({ point, items })
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

      return response.json(points)
    } catch (e) {
      console.log(e)
    }
  }
}

export default PointController
