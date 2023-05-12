import { Request, Response, Router } from "express";
import { yearController } from "../controller/yearController";

export const YearRouter = Router()

YearRouter.get('/', (req: Request, res: Response) => {
  yearController.getAll()
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

YearRouter.get('/:id', (req: Request, res: Response) => {
  yearController.findOneBy(req.params.id)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

YearRouter.post('/', (req: Request, res: Response) => {
  yearController.saveData(req.body)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

YearRouter.put('/:id', (req: Request, res: Response) => {
  yearController.updateOneBy(req.params.id, req.body)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

YearRouter.delete('/:id', (req: Request, res: Response) => {
  yearController.deleteOneBy(req.params.id)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})
