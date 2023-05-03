import { Request, Response, Router } from "express";
import { disciplineController } from "../controller/discipline-controller";

export const DisciplineRouter = Router()

DisciplineRouter.get('/', (req: Request, res: Response) => {
  disciplineController.getAll()
    // TODO: Add response status code
    .then(r => res.json({ method: 'GET', resource: '/discipline', payload: r }))
})

DisciplineRouter.get('/:id', (req: Request, res: Response) => {
  disciplineController.findOneBy(req.params.id)
    // TODO: Add response status code
    .then(r => res.json({ method: 'GET', resource: '/discipline', payload: r }))
})

DisciplineRouter.post('/', (req: Request, res: Response) => {
  disciplineController.saveData(req.body)
    // TODO: Add response status code
    .then(r => res.json({ method: 'POST', resource: '/discipline', payload: r }))
})

DisciplineRouter.put('/:id', (req: Request, res: Response) => {
  disciplineController.updateOneBy(req.params.id, req.body)
    // TODO: Add response status code
    .then(r => res.json({ method: 'PUT', resource: '/discipline', payload: r }))
})

DisciplineRouter.delete('/:id', (req: Request, res: Response) => {
  disciplineController.deleteOneBy(req.params.id)
    // TODO: Add response status code
    .then(r => res.json({ method: 'DELETE', resource: '/discipline', payload: r }))
})
