import { NextFunction, Request, Response } from "express";

import havePermission from '../utils/permissions'

export default (req: Request, res: Response, next: NextFunction) => {

  const { user } = req.body

  const entity = req.baseUrl.split('/')[1]

  const method = req.method

  const condition = havePermission(user.category, entity, method)

  if(!condition) return res.status(403).json({ method: req.method, resource: req.baseUrl, payload: { message: 'Você não tem permissão para acessar ou modificar este recurso!' } })

  next()
}
