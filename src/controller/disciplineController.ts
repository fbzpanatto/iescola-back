import { GenericController } from "./genericController";
import { Discipline } from "../entity/Discipline";
import { EntityTarget, ObjectLiteral } from "typeorm";

class DisciplineController extends GenericController<EntityTarget<ObjectLiteral>> {
  constructor() {
    super(Discipline);
  }

}

export const disciplineController = new DisciplineController();
