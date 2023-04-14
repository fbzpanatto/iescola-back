import { Request, Response, Router } from "express";
import { bimesterController } from "../controller/bimester-controller";

export const BimesterRouter = Router()

BimesterRouter.get('/', (req: Request, res: Response) => {
  bimesterController.getAll()
    // TODO: Add response status code
    .then(r => res.json({ method: 'GET', resource: '/school', payload: r }))
})

BimesterRouter.get('/:id', (req: Request, res: Response) => {
  bimesterController.findOneBy(req.params.id)
    // TODO: Add response status code
    .then(r => res.json({ method: 'GET', resource: '/school', payload: r }))
})

BimesterRouter.post('/', (req: Request, res: Response) => {
  bimesterController.saveData(req.body)
    // TODO: Add response status code
    .then(r => res.json({ method: 'POST', resource: '/school', payload: r }))
})

BimesterRouter.put('/:id', (req: Request, res: Response) => {
  bimesterController.updateOneBy(req.params.id, req.body)
    // TODO: Add response status code
    .then(r => res.json({ method: 'PUT', resource: '/school', payload: r }))
})

BimesterRouter.delete('/:id', (req: Request, res: Response) => {
  bimesterController.deleteOneBy(req.params.id)
    // TODO: Add response status code
    .then(r => res.json({ method: 'DELETE', resource: '/school', payload: r }))
})
