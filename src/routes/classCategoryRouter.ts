import { Request, Response, Router } from "express";
import { classCategoryController } from "../controller/classCategoryController";

export const ClassCategoryRouter = Router()

ClassCategoryRouter.get('/', (req: Request, res: Response) => {
  classCategoryController.getAll()
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

ClassCategoryRouter.get('/:id', (req: Request, res: Response) => {
  classCategoryController.findOneBy(req.params.id)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

ClassCategoryRouter.post('/', (req: Request, res: Response) => {
  classCategoryController.saveData(req.body)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

ClassCategoryRouter.put('/:id', (req: Request, res: Response) => {
  classCategoryController.updateOneBy(req.params.id, req.body)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

ClassCategoryRouter.delete('/:id', (req: Request, res: Response) => {
  classCategoryController.deleteOneBy(req.params.id)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})
