import { Request, Response, Router } from "express";
import { testCategoryController } from "../controller/testCategory-controller";

export const TestCategoryRouter = Router()

TestCategoryRouter.get('/', (req: Request, res: Response) => {
  testCategoryController.getAll()
    // TODO: Add response status code
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

TestCategoryRouter.get('/:id', (req: Request, res: Response) => {
  testCategoryController.findOneBy(req.params.id)
    // TODO: Add response status code
    .then(r => res.json({ method: 'GET', resource: req.baseUrl, payload: r }))
})

TestCategoryRouter.post('/', (req: Request, res: Response) => {
  testCategoryController.saveData(req.body)
    // TODO: Add response status code
    .then(r => res.json({ method: 'POST', resource: req.baseUrl, payload: r }))
})

TestCategoryRouter.put('/:id', (req: Request, res: Response) => {
  testCategoryController.updateOneBy(req.params.id, req.body)
    // TODO: Add response status code
    .then(r => res.json({ method: 'PUT', resource: req.baseUrl, payload: r }))
})

TestCategoryRouter.delete('/:id', (req: Request, res: Response) => {
  testCategoryController.deleteOneBy(req.params.id)
    // TODO: Add response status code
    .then(r => res.json({ method: 'DELETE', resource: req.baseUrl, payload: r }))
})
