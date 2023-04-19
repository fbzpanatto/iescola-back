import { GenericController } from "./generic-controller";
import { EntityTarget, ObjectLiteral } from "typeorm";
import { TeacherDisciplines } from "../entity/TeacherDisciplines";

class TeacherDisciplinesController extends GenericController<EntityTarget<ObjectLiteral>> {
  constructor() {
    super(TeacherDisciplines);
  }

}

export const teacherDisciplinesController = new TeacherDisciplinesController();
