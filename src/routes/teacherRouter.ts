import { Request, Response, Router } from "express";
import { teacherController } from "../controller/teacherController";
import userHasPermission from "../middleware/havePermission";

export const TeacherRouter = Router()

TeacherRouter.get('/', (req: Request, res: Response) => {
  teacherController.getAllTeachers(req)
    .then(r => res.status(r.status).json({ method: req.method, resource: req.baseUrl, payload: r.data }))
})

TeacherRouter.get('/:id', userHasPermission, (req: Request, res: Response) => {
  teacherController.getOneTeacher(req)
    .then(r => res.status(r.status).json({ method: req.method, resource: req.baseUrl, payload: r.data }))
})

TeacherRouter.post('/', userHasPermission, (req: Request, res: Response) => {
  teacherController.saveData(req.body)
    .then(r => res.status(r.status).json({ method: req.method, resource: req.baseUrl, payload: r.data }))
})

TeacherRouter.put('/:id', userHasPermission, (req: Request, res: Response) => {
  teacherController.updateOneData(req)
    .then(r => res.status(r.status).json({ method: req.method, resource: req.baseUrl, payload: r.data }))
})

// TeacherRouter.post('/create-for-all', (req: Request, res: Response) => {
//   teacherController.createForAll(req.body)
//     .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
// })
