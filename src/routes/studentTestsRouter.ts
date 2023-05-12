import { Request, Response, Router } from "express";
import { studentTestsController } from "../controller/studentTestsController";

export const StudentTestsRouter = Router()

StudentTestsRouter.get('/register-answers', (req: Request, res: Response) => {
  studentTestsController.registerAnswers(req)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

StudentTestsRouter.get('/', (req: Request, res: Response) => {
  studentTestsController.getAll()
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

StudentTestsRouter.get('/:id', (req: Request, res: Response) => {
  studentTestsController.findOneBy(req.params.id)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

StudentTestsRouter.post('/', (req: Request, res: Response) => {
  studentTestsController.saveData(req.body)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

StudentTestsRouter.put('/:id', (req: Request, res: Response) => {
  studentTestsController.updateOneBy(req.params.id, req.body)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

StudentTestsRouter.delete('/:id', (req: Request, res: Response) => {
  studentTestsController.deleteOneBy(req.params.id)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})
