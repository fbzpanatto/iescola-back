import { Request, Response, Router } from "express";
import { teacherController } from "../controller/teacher-controller";

export const TeacherRouter = Router()

TeacherRouter.get('/', (req: Request, res: Response) => {
  teacherController.getAll()
    // TODO: Add response status code
    .then(r => res.json({ method: 'GET', resource: '/teacher', payload: r }))
})

TeacherRouter.get('/:id', (req: Request, res: Response) => {
  teacherController.findOneBy(req.params.id)
    // TODO: Add response status code
    .then(r => res.json({ method: 'GET', resource: '/teacher', payload: r }))
})

TeacherRouter.post('/', (req: Request, res: Response) => {
  teacherController.saveData(req.body)
    .then(r => res.json({ method: 'POST', resource: '/teacher', payload: r }))
})
