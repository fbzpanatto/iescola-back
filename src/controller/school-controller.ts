import { GenericController } from "./generic-controller";
import { School } from "../entity/School";
import { EntityTarget, ObjectLiteral } from "typeorm";

class SchoolController extends GenericController<EntityTarget<ObjectLiteral>> {
  constructor() {
    super(School);
  }

}

export const schoolController = new SchoolController();
