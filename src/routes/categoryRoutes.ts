import { Request, Response, Router } from "express";
import { categoryController } from "../controller/categoryController";

export const CategoryRouter = Router()

CategoryRouter.get('/', (req: Request, res: Response) => {
  categoryController.getAll()
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

CategoryRouter.get('/:id', (req: Request, res: Response) => {
  categoryController.findOneBy(req.params.id)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

CategoryRouter.post('/', (req: Request, res: Response) => {
  categoryController.saveData(req.body)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

CategoryRouter.put('/:id', (req: Request, res: Response) => {
  categoryController.updateOneBy(req.params.id, req.body)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

CategoryRouter.delete('/:id', (req: Request, res: Response) => {
  categoryController.deleteOneBy(req.params.id)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})
