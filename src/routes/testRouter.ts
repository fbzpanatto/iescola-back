import { Request, Response, Router } from "express";
import { testController } from "../controller/testController";
import isTeacher from "../middleware/isTeacher";

export const TestRouter = Router()

TestRouter.get('/', (req: Request, res: Response) => {
  testController.getAllWithTerm(req)
    .then(r => res.status(r.status).json({ method: req.method, resource: req.baseUrl, payload: r.data }))
})

TestRouter.get('/:id', (req: Request, res: Response) => {
  testController.getOne(req)
    .then(r => res.status(r.status).json({ method: req.method, resource: req.baseUrl, payload: r.data }))
})

TestRouter.post('/', isTeacher,  (req: Request, res: Response) => {
  testController.saveData(req.body)
    .then(r => res.status(r.status).json({ method: req.method, resource: req.baseUrl, payload: r.data }))
})

TestRouter.put('/:id', isTeacher,  (req: Request, res: Response) => {
  testController.updateOneBy(req.params.id, req.body)
    .then(r => res.status(r.status).json({ method: req.method, resource: req.baseUrl, payload: r.data }))
})

TestRouter.delete('/:id', isTeacher,  (req: Request, res: Response) => {
  testController.deleteOneBy(req.params.id)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})
