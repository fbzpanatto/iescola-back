import { Request, Response, NextFunction} from "express";
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

    const user = jwt.verify(token, 'SECRET');
    // req.body.user = user.user
    req.body.category = user.category
    next()

  } catch (error) {
    res.status(401).json({
      status: 'fail',
      message: 'Unauthorized!'
    })
  }
}
