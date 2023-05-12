import { Request, Response, Router } from "express";
import { testCategoryController } from "../controller/testCategoryController";

export const TestCategoryRouter = Router()

TestCategoryRouter.get('/', (req: Request, res: Response) => {
  testCategoryController.getAll()
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

TestCategoryRouter.get('/:id', (req: Request, res: Response) => {
  testCategoryController.findOneBy(req.params.id)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

TestCategoryRouter.post('/', (req: Request, res: Response) => {
  testCategoryController.saveData(req.body)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

TestCategoryRouter.put('/:id', (req: Request, res: Response) => {
  testCategoryController.updateOneBy(req.params.id, req.body)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

TestCategoryRouter.delete('/:id', (req: Request, res: Response) => {
  testCategoryController.deleteOneBy(req.params.id)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})
