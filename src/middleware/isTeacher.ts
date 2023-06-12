import { Request, Response, NextFunction} from "express";

export const categoryOfTeachers = [1, 3]

export default (req: Request, res: Response, next: NextFunction) => {

  const { user } = req.body

  if(!categoryOfTeachers.includes(user.category)) {
    return res.status(403).json({
      status: 'fail',
      message: 'Forbidden!'
    })
  }
  next()
}
