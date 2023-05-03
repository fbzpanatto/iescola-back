import { Request, Response, Router } from "express";
import { yearController } from "../controller/year-controller";

export const YearRouter = Router()

YearRouter.get('/', (req: Request, res: Response) => {
  yearController.getAll()
    // TODO: Add response status code
    .then(r => res.json({ method: 'GET', resource: '/year', payload: r }))
})

YearRouter.get('/:id', (req: Request, res: Response) => {
  yearController.findOneBy(req.params.id)
    // TODO: Add response status code
    .then(r => res.json({ method: 'GET', resource: '/year', payload: r }))
})

YearRouter.post('/', (req: Request, res: Response) => {
  yearController.saveData(req.body)
    // TODO: Add response status code
    .then(r => res.json({ method: 'POST', resource: '/year', payload: r }))
})

YearRouter.put('/:id', (req: Request, res: Response) => {
  yearController.updateOneBy(req.params.id, req.body)
    // TODO: Add response status code
    .then(r => res.json({ method: 'PUT', resource: '/year', payload: r }))
})

YearRouter.delete('/:id', (req: Request, res: Response) => {
  yearController.deleteOneBy(req.params.id)
    // TODO: Add response status code
    .then(r => res.json({ method: 'DELETE', resource: '/year', payload: r }))
})
