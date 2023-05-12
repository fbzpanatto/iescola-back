import { Request, Response, Router } from "express";
import { bimesterController } from "../controller/bimesterController";

export const BimesterRouter = Router()

BimesterRouter.get('/', (req: Request, res: Response) => {
  bimesterController.getAll()
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

BimesterRouter.get('/:id', (req: Request, res: Response) => {
  bimesterController.findOneBy(req.params.id)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

BimesterRouter.post('/', (req: Request, res: Response) => {
  bimesterController.saveData(req.body)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

BimesterRouter.put('/:id', (req: Request, res: Response) => {
  bimesterController.updateOneBy(req.params.id, req.body)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

BimesterRouter.delete('/:id', (req: Request, res: Response) => {
  bimesterController.deleteOneBy(req.params.id)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})
