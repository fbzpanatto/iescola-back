import { Request, Response, Router } from "express";
import {testClassesController} from "../controller/testClasses-controller";

export const TestClassesRouter = Router()

TestClassesRouter.get('/', (req: Request, res: Response) => {
  testClassesController.getAll()
    // TODO: Add response status code
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

TestClassesRouter.get('/:id', (req: Request, res: Response) => {
  testClassesController.findOneBy(req.params.id)
    // TODO: Add response status code
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

TestClassesRouter.post('/', (req: Request, res: Response) => {
  testClassesController.saveData(req.body)
    // TODO: Add response status code
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

TestClassesRouter.put('/:id', (req: Request, res: Response) => {
  testClassesController.updateOneBy(req.params.id, req.body)
    // TODO: Add response status code
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

TestClassesRouter.delete('/:id', (req: Request, res: Response) => {
  testClassesController.deleteOneBy(req.params.id)
    // TODO: Add response status code
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})
