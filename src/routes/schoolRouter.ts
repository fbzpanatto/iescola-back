import { Request, Response, Router } from "express";
import { schoolController } from "../controller/schoolController";

export const SchoolRouter = Router()

SchoolRouter.get('/', (req: Request, res: Response) => {
  schoolController.getAll()
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

SchoolRouter.get('/:id', (req: Request, res: Response) => {
  schoolController.findOneBy(req.params.id)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

SchoolRouter.post('/', (req: Request, res: Response) => {
  schoolController.saveData(req.body)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

SchoolRouter.post('/many', (req: Request, res: Response) => {
  schoolController.manyData(req.body)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

SchoolRouter.put('/:id', (req: Request, res: Response) => {
  schoolController.updateOneBy(req.params.id, req.body)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

SchoolRouter.delete('/:id', (req: Request, res: Response) => {
  schoolController.deleteOneBy(req.params.id)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})
