import { Request, Response, Router } from "express";
import { studentController } from "../controller/student-controller";

export const StudentRouter = Router()

StudentRouter.get('/', (req: Request, res: Response) => {
  studentController.getAll({ relations: ['classroom']})
    .then(r => res.status(200).json({ method: 'GET', resource: '/student', payload: r }))
})

StudentRouter.get('/:id', (req: Request, res: Response) => {
  studentController.findOneBy(req.params.id)
    // TODO: Add response status code
    .then(r => res.json({ method: 'GET', resource: '/student', payload: r }))
})

StudentRouter.put('/:id', (req: Request, res: Response) => {
  studentController.updateOneBy(req.params.id, req.body)
    // TODO: Add response status code
    .then(r => res.json({ method: 'PUT', resource: '/student', payload: r }))
})
