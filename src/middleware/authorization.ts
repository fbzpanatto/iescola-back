import {NextFunction, Request, Response} from "express";

const jwt = require('jsonwebtoken')

export default (req: Request, res: Response, next: NextFunction) => {

  const authHeader = req.headers.authorization;
  if(!authHeader) {

    return res.status(401).json({
      status: 'fail',
      message: 'Unauthorized!'
    })
  }

  const token = authHeader.split(' ')[1];

  try {

    req.body.user = jwt.verify(token, 'SECRET')

    next()

  } catch (error) {
    res.status(401).json({
      status: 'fail',
      message: 'Unauthorized!'
    })
  }
}
