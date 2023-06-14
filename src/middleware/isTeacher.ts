import { Request, Response, NextFunction} from "express";

export enum enumOfTeacherCategories {
  teacher = 1,
  superTeacher = 3
}

export const isTeacher = (category: number) => {
  for(const category in enumOfTeacherCategories) {
    if(enumOfTeacherCategories[category] === category) {
      return true
    }
  }
  return false
}

export default (req: Request, res: Response, next: NextFunction) => {

  const { user } = req.body

  const condition = isTeacher(user.category)

  if(!condition) {
    return res.status(403).json({
      status: 'fail',
      message: 'Forbidden!'
    })
  }
  next()
}
