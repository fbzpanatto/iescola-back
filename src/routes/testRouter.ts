import { Request, Response, Router } from "express";
import { testController } from "../controller/testController";

export const TestRouter = Router()

TestRouter.get('/', (req: Request, res: Response) => {
  testController.getAll()
    // TODO: Add response status code
    .then(r => res.json({ method: 'GET', resource: '/test', payload: r }))
})

TestRouter.get('/:id', (req: Request, res: Response) => {
  testController.getOne(req.params.id)
    // TODO: Add response status code
    .then(r => res.json({ method: 'GET', resource: '/test', payload: r }))
})

TestRouter.post('/', (req: Request, res: Response) => {
  testController.saveData(req.body)
    // TODO: Add response status code
    .then(r => res.json({ method: 'POST', resource: '/test', payload: r }))
})

TestRouter.post('/many', (req: Request, res: Response) => {
  testController.many(req.body)
      // TODO: Add response status code
      .then(r => res.json({ method: 'POST', resource: '/test', payload: r }))
})

TestRouter.put('/:id', (req: Request, res: Response) => {
  testController.updateOneBy(req.params.id, req.body)
    // TODO: Add response status code
    .then(r => res.json({ method: 'PUT', resource: '/test', payload: r }))
})

TestRouter.delete('/:id', (req: Request, res: Response) => {
  testController.deleteOneBy(req.params.id)
    // TODO: Add response status code
    .then(r => res.json({ method: 'DELETE', resource: '/test', payload: r }))
})
