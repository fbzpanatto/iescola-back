import { Request, Response, Router } from "express";
import { studentController } from "../controller/student-controller";

export const StudentRouter = Router()

StudentRouter.get('/register-answers', (req: Request, res: Response) => {
  studentController.linkStudentsWithTests(req)
    .then(r => res.status(200).json({ method: 'GET', resource: '/student', payload: r }))
})

StudentRouter.get('/:id', (req: Request, res: Response) => {
  studentController.findOneBy(req.params.id)
    .then(r => res.status(200).json({ method: 'GET', resource: '/student', payload: r }))
})

StudentRouter.post('/', (req: Request, res: Response) => {
  studentController.saveData(req.body)
    .then(r => res.status(201).json({ method: 'POST', resource: '/student', payload: r }))
})

StudentRouter.put('/:id', (req: Request, res: Response) => {
  studentController.updateOneBy(req.params.id, req.body)
    .then(r => res.status(200).json({ method: 'PUT', resource: '/student', payload: r }))
})
