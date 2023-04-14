import { Request, Response, Router } from "express";
import { testController } from "../controller/test-controller";

export const TeacherRouter = Router()

TeacherRouter.get('/', (req: Request, res: Response) => {
  testController.getAll()
    // TODO: Add response status code
    .then(r => res.json({ method: 'GET', resource: '/teacher', payload: r }))
})

TeacherRouter.get('/:id', (req: Request, res: Response) => {
  testController.findOneBy(req.params.id)
    // TODO: Add response status code
    .then(r => res.json({ method: 'GET', resource: '/teacher', payload: r }))
})

TeacherRouter.post('/', (req: Request, res: Response) => {
  testController.saveData(req.body)
    // TODO: Add response status code
    .then(r => res.json({ method: 'POST', resource: '/teacher', payload: r }))
})

TeacherRouter.put('/:id', (req: Request, res: Response) => {
  testController.updateOneBy(req.params.id, req.body)
    // TODO: Add response status code
    .then(r => res.json({ method: 'PUT', resource: '/teacher', payload: r }))
})

TeacherRouter.delete('/:id', (req: Request, res: Response) => {
  testController.deleteOneBy(req.params.id)
    // TODO: Add response status code
    .then(r => res.json({ method: 'DELETE', resource: '/teacher', payload: r }))
})
