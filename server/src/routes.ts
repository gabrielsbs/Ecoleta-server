import express from 'express'
import knex from './database/connection'
import { Item, Point } from './models'
import PointController from './controllers/PointsController'
import ItemsController from './controllers/ItemsController'

const routes = express.Router()
const pointController = new PointController()
const itemController = new ItemsController()
routes.get('/items', itemController.index)

routes.post('/points', pointController.create)
routes.get('/points/:id', pointController.show)
routes.get('/points', pointController.index)

export default routes
