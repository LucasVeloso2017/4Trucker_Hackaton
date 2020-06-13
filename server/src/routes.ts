import express from 'express'

import PointController from './controllers/pointsController'
import ItemsController from './controllers/itemsController'
import multer from 'multer'
import multerConfig from './config/multer'

const pointController = new PointController()
const itemsController = new ItemsController()


const routes = express.Router()
const upload = multer(multerConfig)

routes.get('/items',itemsController.index)


routes.post('/points',upload.single('image'),pointController.create)


routes.get('/points/:id',pointController.show)
routes.get('/points',pointController.index)


export default routes;