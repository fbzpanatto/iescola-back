import { GenericController } from "./genericController";
import { EntityTarget, ObjectLiteral } from "typeorm";
import { Year } from "../entity/Year";

class YearController extends GenericController<EntityTarget<ObjectLiteral>> {
  constructor() {
    super(Year);
  }

}

export const yearController = new YearController();
