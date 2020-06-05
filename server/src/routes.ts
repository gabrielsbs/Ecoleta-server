import express from 'express'
import multer from 'multer'

import multerConfig from './config/multer'
import celebrateConfig from './config/celebrate'
import PointController from './controllers/PointsController'
import ItemsController from './controllers/ItemsController'

const routes = express.Router()
const upload = multer(multerConfig)

const pointController = new PointController()
const itemController = new ItemsController()

routes.get('/items', itemController.index)

routes.post('/points', upload.single('image'), celebrateConfig, pointController.create)
routes.get('/points/:id', pointController.show)
routes.get('/points', pointController.index)

export default routes
