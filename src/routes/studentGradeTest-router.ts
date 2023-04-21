import { Request, Response, Router } from "express";
import { studentTestsController as sgtController } from "../controller/studentTests-controller";

export const SgtRouter = Router()

SgtRouter.get('/', (req: Request, res: Response) => {
  sgtController.getAll()
    // TODO: Add response status code
    .then(r => res.json({ method: 'GET', resource: '/student-grade-test', payload: r }))
})

SgtRouter.get('/:id', (req: Request, res: Response) => {
  sgtController.findOneBy(req.params.id)
    // TODO: Add response status code
    .then(r => res.json({ method: 'GET', resource: '/student-grade-test', payload: r }))
})

SgtRouter.post('/', (req: Request, res: Response) => {
  sgtController.saveData(req.body)
    // TODO: Add response status code
    .then(r => res.json({ method: 'POST', resource: '/student-grade-test', payload: r }))
})

SgtRouter.put('/:id', (req: Request, res: Response) => {
  sgtController.updateOneBy(req.params.id, req.body)
    // TODO: Add response status code
    .then(r => res.json({ method: 'PUT', resource: '/student-grade-test', payload: r }))
})

SgtRouter.delete('/:id', (req: Request, res: Response) => {
  sgtController.deleteOneBy(req.params.id)
    // TODO: Add response status code
    .then(r => res.json({ method: 'DELETE', resource: '/student-grade-test', payload: r }))
})
