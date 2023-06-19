import { Request, Response, Router } from "express";
import { classroomController } from "../controller/classroomController";

export const ClassroomRouter = Router()

ClassroomRouter.get('/:id/students', (req: Request, res: Response) => {
  classroomController.findOneBy(req.params.id)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

ClassroomRouter.get('/:id', (req: Request, res: Response) => {
  classroomController.findOneBy(req.params.id)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

ClassroomRouter.get('/', (req: Request, res: Response) => {
  classroomController.getAllClasses(req)
    .then(r => res.status(r.status).json({ method: req.method, resource: req.baseUrl, payload: r.data }))
})

ClassroomRouter.post('/many', (req: Request, res: Response) => {
  classroomController.many(req.body)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

ClassroomRouter.post('/', (req: Request, res: Response) => {
  classroomController.saveData(req.body)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

ClassroomRouter.put('/:id', (req: Request, res: Response) => {
  classroomController.updateOneBy(req.params.id, req.body)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

ClassroomRouter.delete('/:id', (req: Request, res: Response) => {
  classroomController.deleteOneBy(req.params.id)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})
