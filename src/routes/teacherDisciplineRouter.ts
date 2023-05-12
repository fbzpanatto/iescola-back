import { Request, Response, Router } from "express";
import { teacherDisciplinesController } from "../controller/teacherDisciplinesController";

export const TeacherDisciplineRouter = Router()

TeacherDisciplineRouter.get('/', (req: Request, res: Response) => {
  teacherDisciplinesController.getAll()
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

TeacherDisciplineRouter.get('/:id', (req: Request, res: Response) => {
  teacherDisciplinesController.findOneBy(req.params.id)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

TeacherDisciplineRouter.post('/', (req: Request, res: Response) => {
  teacherDisciplinesController.saveData(req.body)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

TeacherDisciplineRouter.put('/:id', (req: Request, res: Response) => {
  teacherDisciplinesController.updateOneBy(req.params.id, req.body)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

TeacherDisciplineRouter.delete('/:id', (req: Request, res: Response) => {
  teacherDisciplinesController.deleteOneBy(req.params.id)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})
