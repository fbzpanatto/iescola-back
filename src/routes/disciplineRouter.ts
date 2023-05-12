import { Request, Response, Router } from "express";
import { disciplineController } from "../controller/disciplineController";

export const DisciplineRouter = Router()

DisciplineRouter.get('/', (req: Request, res: Response) => {
  disciplineController.getAll()
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

DisciplineRouter.get('/:id', (req: Request, res: Response) => {
  disciplineController.findOneBy(req.params.id)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

DisciplineRouter.post('/', (req: Request, res: Response) => {
  disciplineController.saveData(req.body)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

DisciplineRouter.put('/:id', (req: Request, res: Response) => {
  disciplineController.updateOneBy(req.params.id, req.body)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

DisciplineRouter.delete('/:id', (req: Request, res: Response) => {
  disciplineController.deleteOneBy(req.params.id)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})
