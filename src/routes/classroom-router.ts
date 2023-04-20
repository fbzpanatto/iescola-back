import { Request, Response, Router } from "express";
import { classroomController } from "../controller/classroom-controller";

export const ClassroomRouter = Router()

ClassroomRouter.get('/:id/students', (req: Request, res: Response) => {
  classroomController.findOneBy(req.params.id)
    .then(r => res.status(200).json({ method: 'GET', resource: '/classroom/' + req.params.id + '/students', payload: r }))
})

ClassroomRouter.get('/', (req: Request, res: Response) => {
  classroomController.getAll()
    // TODO: Add response status code
    .then(r => res.json({ method: 'GET', resource: '/classroom', payload: r }))
})

ClassroomRouter.get('/:id', (req: Request, res: Response) => {
  classroomController.findOneBy(req.params.id)
    // TODO: Add response status code
    .then(r => res.json({ method: 'GET', resource: '/classroom', payload: r }))
})

ClassroomRouter.post('/', (req: Request, res: Response) => {
  classroomController.saveData(req.body)
    // TODO: Add response status code
    .then(r => res.json({ method: 'POST', resource: '/classroom', payload: r }))
})

ClassroomRouter.put('/:id', (req: Request, res: Response) => {
  classroomController.updateOneBy(req.params.id, req.body)
    // TODO: Add response status code
    .then(r => res.json({ method: 'PUT', resource: '/classroom', payload: r }))
})

ClassroomRouter.delete('/:id', (req: Request, res: Response) => {
  classroomController.deleteOneBy(req.params.id)
    // TODO: Add response status code
    .then(r => res.json({ method: 'DELETE', resource: '/classroom', payload: r }))
})
