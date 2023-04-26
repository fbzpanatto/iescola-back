import { Request, Response, Router } from "express";
import { classCategoryController } from "../controller/classCategory-controller";

export const ClassCategoryRouter = Router()

ClassCategoryRouter.get('/', (req: Request, res: Response) => {
  classCategoryController.getAll()
    // TODO: Add response status code
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

ClassCategoryRouter.get('/:id', (req: Request, res: Response) => {
  classCategoryController.findOneBy(req.params.id)
    // TODO: Add response status code
    .then(r => res.json({ method: 'GET', resource: req.baseUrl, payload: r }))
})

ClassCategoryRouter.post('/', (req: Request, res: Response) => {
  classCategoryController.saveData(req.body)
    // TODO: Add response status code
    .then(r => res.json({ method: 'POST', resource: req.baseUrl, payload: r }))
})

ClassCategoryRouter.put('/:id', (req: Request, res: Response) => {
  classCategoryController.updateOneBy(req.params.id, req.body)
    // TODO: Add response status code
    .then(r => res.json({ method: 'PUT', resource: req.baseUrl, payload: r }))
})

ClassCategoryRouter.delete('/:id', (req: Request, res: Response) => {
  classCategoryController.deleteOneBy(req.params.id)
    // TODO: Add response status code
    .then(r => res.json({ method: 'DELETE', resource: req.baseUrl, payload: r }))
})
