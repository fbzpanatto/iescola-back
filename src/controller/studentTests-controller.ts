import { GenericController } from "./generic-controller";
import { StudentTests } from "../entity/StudentTests";
import { EntityTarget, ObjectLiteral } from "typeorm";

class StudentTestsController extends GenericController<EntityTarget<ObjectLiteral>> {
  constructor() {
    super(StudentTests);
  }
}

export const studentTestsController = new StudentTestsController();
