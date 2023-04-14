import { Request, Response, Router } from "express";
import { personController } from "../controller/person-controller";

export const PersonRouter = Router()

PersonRouter.get('/', (req: Request, res: Response) => {

  personController.getAll()
    // TODO: Add response status code
    .then(r => res.json({ method: 'GET', resource: req.baseUrl, payload: r }))
})

PersonRouter.get('/:id', (req: Request, res: Response) => {
  personController.findOneBy(req.params.id)
    // TODO: Add response status code
    .then(r => res.json({ method: 'GET', resource: req.baseUrl, payload: r }))
})

PersonRouter.post('/', (req: Request, res: Response) => {
  personController.saveData(req.body)
    // TODO: Add response status code
    .then(r => res.json({ method: 'POST', resource: req.baseUrl, payload: r }))
})

PersonRouter.put('/:id', (req: Request, res: Response) => {
  personController.updateOneBy(req.params.id, req.body)
    // TODO: Add response status code
    .then(r => res.json({ method: 'PUT', resource: req.baseUrl, payload: r }))
})

PersonRouter.delete('/:id', (req: Request, res: Response) => {
  personController.deleteOneBy(req.params.id)
    // TODO: Add response status code
    .then(r => res.json({ method: 'DELETE', resource: req.baseUrl, payload: r }))
})
