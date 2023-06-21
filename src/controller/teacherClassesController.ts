import { GenericController } from "./genericController";
import { EntityTarget, ObjectLiteral } from "typeorm";
import { TeacherClasses } from "../entity/TeacherClasses";
import { Teacher } from "../entity/Teacher";
import { Classroom } from "../entity/Classroom";
import { Request } from "express";

import { teacherController } from "./teacherController";
import { classroomController } from "./classroomController";

class TeacherClassesController extends GenericController<EntityTarget<ObjectLiteral>> {
  constructor() {
    super(TeacherClasses);
  }

  override async saveData(req: Request) {

    try {

      const teacher = await teacherController.findOneBy(Number(req.body.teacher.id)) as Teacher
      const classroom = await classroomController.findOneBy(Number(req.body.classroom.id)) as Classroom

      if(!teacher || !classroom) {
        return { status: 400, data: 'Teacher or classroom not found' }
      }

      req.body.teacher = teacher
      req.body.classroom = classroom

      const result = await this.repository.save(req.body)

      return { status: 200, data: result }

    } catch (error) {
      return { status: 500, data: error }
    }
  }

}

export const teacherClassesController = new TeacherClassesController();
