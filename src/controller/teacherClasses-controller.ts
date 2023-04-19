import { GenericController } from "./generic-controller";
import { EntityTarget, ObjectLiteral } from "typeorm";
import { TeacherClasses } from "../entity/TeacherClasses";

class TeacherClassesController extends GenericController<EntityTarget<ObjectLiteral>> {
  constructor() {
    super(TeacherClasses);
  }

}

export const teacherClassesController = new TeacherClassesController();
