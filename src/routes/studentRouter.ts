import { Request, Response, Router } from "express";
import { studentController } from "../controller/studentController";

export const StudentRouter = Router()

StudentRouter.get('/test-creation', (req: Request, res: Response) => {
  studentController.testCreation()
      .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

StudentRouter.get('/:id', (req: Request, res: Response) => {
  studentController.findOneBy(req.params.id)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

StudentRouter.post('/', (req: Request, res: Response) => {
  studentController.saveData(req.body)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

StudentRouter.put('/:id', (req: Request, res: Response) => {
  studentController.updateOneBy(req.params.id, req.body)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})
