import { Request, Response, Router } from "express";
import { teacherController } from "../controller/teacherController";

export const TeacherRouter = Router()

TeacherRouter.get('/', (req: Request, res: Response) => {
  teacherController.getAllTeachers(req)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

TeacherRouter.get('/:id', (req: Request, res: Response) => {
  teacherController.getOneTeacher(req)
    .then(r => res.status(r.status).json({ method: req.method, resource: req.baseUrl, payload: r.data }))
})

TeacherRouter.post('/', (req: Request, res: Response) => {
  teacherController.saveData(req.body)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

TeacherRouter.post('/create-for-all', (req: Request, res: Response) => {
  teacherController.createForAll(req.body)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})
