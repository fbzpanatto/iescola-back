import { GenericController } from "./genericController";
import { EntityTarget, ObjectLiteral } from "typeorm";
import { StudentClassesHistory } from "../entity/StudentClassesHistory";

class StudentClassesController extends GenericController<EntityTarget<ObjectLiteral>> {
  constructor() {
    super(StudentClassesHistory);
  }
}

export const studentClassesHistoryController = new StudentClassesController();
