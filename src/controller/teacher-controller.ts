import { GenericController } from "./generic-controller";
import { Teacher } from "../entity/Teacher";
import { EntityTarget, ObjectLiteral } from "typeorm";

class TeacherController extends GenericController<EntityTarget<ObjectLiteral>> {
  constructor() {
    super(Teacher);
  }

}

export const teacherController = new TeacherController();
