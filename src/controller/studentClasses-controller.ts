import { GenericController } from "./generic-controller";
import { EntityTarget, ObjectLiteral } from "typeorm";
import { StudentClasses } from "../entity/StudentClasses";

class StudentClassesController extends GenericController<EntityTarget<ObjectLiteral>> {
  constructor() {
    super(StudentClasses);
  }
}

export const studentClassesController = new StudentClassesController();
