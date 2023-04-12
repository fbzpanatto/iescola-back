import { Request, Response, Router } from "express";
import { schoolController } from "../controller/school-controller";

export const SchoolRouter = Router()

SchoolRouter.get('/', (req: Request, res: Response) => {
  schoolController.getAll()
    // TODO: Add response status code
    .then(r => res.json({ method: 'GET', resource: '/school', payload: r }))
})

SchoolRouter.get('/:id', (req: Request, res: Response) => {
  schoolController.findOneBy(req.params.id)
    // TODO: Add response status code
    .then(r => res.json({ method: 'GET', resource: '/school', payload: r }))
})

SchoolRouter.post('/', (req: Request, res: Response) => {
  schoolController.saveData(req.body)
    // TODO: Add response status code
    .then(r => res.json({ method: 'POST', resource: '/school', payload: r }))
})

SchoolRouter.put('/:id', (req: Request, res: Response) => {
  schoolController.updateOneBy(req.params.id, req.body)
    // TODO: Add response status code
    .then(r => res.json({ method: 'PUT', resource: '/school', payload: r }))
})

SchoolRouter.delete('/:id', (req: Request, res: Response) => {
  schoolController.deleteOneBy(req.params.id)
    // TODO: Add response status code
    .then(r => res.json({ method: 'DELETE', resource: '/school', payload: r }))
})
