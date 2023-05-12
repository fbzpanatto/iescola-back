import { Request, Response, Router } from "express";
import { testController } from "../controller/testController";

export const TestRouter = Router()

TestRouter.get('/', (req: Request, res: Response) => {
  testController.getAll()
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

TestRouter.get('/:id', (req: Request, res: Response) => {
  testController.getOne(req.params.id)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

TestRouter.post('/', (req: Request, res: Response) => {
  testController.saveData(req.body)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

TestRouter.put('/:id', (req: Request, res: Response) => {
  testController.updateOneBy(req.params.id, req.body)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

TestRouter.delete('/:id', (req: Request, res: Response) => {
  testController.deleteOneBy(req.params.id)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})
