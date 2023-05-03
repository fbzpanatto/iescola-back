import { Request, Response, Router } from "express";
import { categoryController } from "../controller/category-controller";

export const CategoryRouter = Router()

CategoryRouter.get('/', (req: Request, res: Response) => {
  categoryController.getAll()
    // TODO: Add response status code
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

CategoryRouter.get('/:id', (req: Request, res: Response) => {
  categoryController.findOneBy(req.params.id)
    // TODO: Add response status code
    .then(r => res.json({ method: 'GET', resource: req.baseUrl, payload: r }))
})

CategoryRouter.post('/', (req: Request, res: Response) => {
  categoryController.saveData(req.body)
    // TODO: Add response status code
    .then(r => res.json({ method: 'POST', resource: req.baseUrl, payload: r }))
})

CategoryRouter.put('/:id', (req: Request, res: Response) => {
  categoryController.updateOneBy(req.params.id, req.body)
    // TODO: Add response status code
    .then(r => res.json({ method: 'PUT', resource: req.baseUrl, payload: r }))
})

CategoryRouter.delete('/:id', (req: Request, res: Response) => {
  categoryController.deleteOneBy(req.params.id)
    // TODO: Add response status code
    .then(r => res.json({ method: 'DELETE', resource: req.baseUrl, payload: r }))
})
