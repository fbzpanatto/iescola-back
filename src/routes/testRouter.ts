import { Request, Response, Router } from "express";
import { testController } from "../controller/testController";
import userHasPermission from "../middleware/havePermission";

export const TestRouter = Router()

TestRouter.get('/', userHasPermission, (req: Request, res: Response) => {
  testController.getAllWithTerm(req)
    .then(r => res.status(r.status).json({ method: req.method, resource: req.baseUrl, payload: r.data }))
})

TestRouter.get('/:id', userHasPermission, (req: Request, res: Response) => {
  testController.getOne(req)
    .then(r => res.status(r.status).json({ method: req.method, resource: req.baseUrl, payload: r.data }))
})

TestRouter.post('/', userHasPermission, (req: Request, res: Response) => {
  testController.saveData(req.body)
    .then(r => res.status(r.status).json({ method: req.method, resource: req.baseUrl, payload: r.data }))
})

TestRouter.put('/:id', userHasPermission, (req: Request, res: Response) => {
  testController.updateOneBy(req.params.id, req.body)
    .then(r => res.status(r.status).json({ method: req.method, resource: req.baseUrl, payload: r.data }))
})

TestRouter.delete('/:id', userHasPermission, (req: Request, res: Response) => {
  testController.deleteOneBy(req.params.id)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})
