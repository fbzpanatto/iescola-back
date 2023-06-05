import { Request, Response, Router } from "express";
import { userController } from "../controller/userController";

export const UserRouter = Router()

UserRouter.get('/', (req: Request, res: Response) => {
  userController.getAll()
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

UserRouter.get('/:id', (req: Request, res: Response) => {
  userController.findOneBy(req.params.id)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

UserRouter.post('/', (req: Request, res: Response) => {
  userController.saveData(req.body)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

UserRouter.put('/:id', (req: Request, res: Response) => {
  userController.updateOneBy(req.params.id, req.body)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})

UserRouter.delete('/:id', (req: Request, res: Response) => {
  userController.deleteOneBy(req.params.id)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})
