import { GenericController } from "./generic-controller";
import { Test } from "../entity/Test";
import { EntityTarget, ObjectLiteral } from "typeorm";

class TestController extends GenericController<EntityTarget<ObjectLiteral>> {
  constructor() {
    super(Test);
  }

}

export const testController = new TestController();
