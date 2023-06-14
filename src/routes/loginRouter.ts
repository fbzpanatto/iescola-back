import { Request, Response, Router } from "express";
import { userController } from "../controller/userController";

export const LoginRouter = Router()

LoginRouter.post('/', (req: Request, res: Response) => {
  userController.login(req)
    .then(r => {
      res.status(r.status as number).json({ method: req.method, resource: req.baseUrl, payload: r.data })
    })
})
