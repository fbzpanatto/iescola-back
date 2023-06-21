import { Request, Response, Router } from "express";
import { teacherClassesController } from "../controller/teacherClassesController";

export const TeacherClassRouter = Router()

TeacherClassRouter.get('/', (req: Request, res: Response) => {
  teacherClassesController.getAll()
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

TeacherClassRouter.get('/:id', (req: Request, res: Response) => {
  teacherClassesController.findOneBy(req.params.id)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

TeacherClassRouter.post('/', (req: Request, res: Response) => {
  teacherClassesController.saveData(req)
    .then(r => res.status(r.status).json({ method: req.method, resource: req.baseUrl, payload: r.data }))
})

TeacherClassRouter.put('/:id', (req: Request, res: Response) => {
  teacherClassesController.updateOneBy(req.params.id, req.body)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

TeacherClassRouter.delete('/:id', (req: Request, res: Response) => {
  teacherClassesController.deleteOneBy(req.params.id)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})
