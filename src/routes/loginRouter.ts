import { Request, Response, Router } from "express";
import { userController } from "../controller/userController";

export const LoginRouter = Router()

LoginRouter.post('/', (req: Request, res: Response) => {
  userController.login(req.body)
    .then(r => res.json({ method: req.method, resource: req.baseUrl, payload: r }))
})
