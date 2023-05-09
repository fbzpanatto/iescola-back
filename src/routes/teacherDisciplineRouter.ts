import { Request, Response, Router } from "express";
import { teacherDisciplinesController } from "../controller/teacherDisciplinesController";

export const TeacherDisciplineRouter = Router()

TeacherDisciplineRouter.get('/', (req: Request, res: Response) => {
  teacherDisciplinesController.getAll()
    // TODO: Add response status code
    .then(r => res.json({ method: 'GET', resource: '/bimester', payload: r }))
})

TeacherDisciplineRouter.get('/:id', (req: Request, res: Response) => {
  teacherDisciplinesController.findOneBy(req.params.id)
    // TODO: Add response status code
    .then(r => res.json({ method: 'GET', resource: '/bimester', payload: r }))
})

TeacherDisciplineRouter.post('/', (req: Request, res: Response) => {
  teacherDisciplinesController.saveData(req.body)
    // TODO: Add response status code
    .then(r => res.json({ method: 'POST', resource: '/bimester', payload: r }))
})

TeacherDisciplineRouter.put('/:id', (req: Request, res: Response) => {
  teacherDisciplinesController.updateOneBy(req.params.id, req.body)
    // TODO: Add response status code
    .then(r => res.json({ method: 'PUT', resource: '/bimester', payload: r }))
})

TeacherDisciplineRouter.delete('/:id', (req: Request, res: Response) => {
  teacherDisciplinesController.deleteOneBy(req.params.id)
    // TODO: Add response status code
    .then(r => res.json({ method: 'DELETE', resource: '/bimester', payload: r }))
})
