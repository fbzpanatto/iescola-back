import { GenericController } from "./generic-controller";
import { StudentTests } from "../entity/StudentTests";
import { EntityTarget, ObjectLiteral } from "typeorm";

class StudentGradeTestController extends GenericController<EntityTarget<ObjectLiteral>> {
  constructor() {
    super(StudentTests);
  }
}

export const studentGradeTestController = new StudentGradeTestController();
