import { Request, Response, NextFunction} from "express";

export enum enumOfTeacherCategories {
  teacher = 1,
  superTeacher = 3
}

export const isTeacher = (category: number) => {

  return !!enumOfTeacherCategories[category];

}

export default (req: Request, res: Response, next: NextFunction) => {

  const { user } = req.body

  const condition = isTeacher(user.category as number)

  if(!condition) {
    return res.status(403).json({
      status: 'fail',
      data: 'Forbidden!'
    })
  }
  next()
}
