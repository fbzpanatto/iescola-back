import { GenericController } from "./generic-controller";
import { EntityTarget, ObjectLiteral } from "typeorm";
import { TestClasses } from "../entity/TestClasses";

class TestClassesController extends GenericController<EntityTarget<ObjectLiteral>> {
  constructor() {
    super(TestClasses);
  }

}

export const testClassesController = new TestClassesController();
