import { GenericController } from "./genericController";
import { EntityTarget, ObjectLiteral } from "typeorm";
import { TestCategory } from "../entity/TestCategory";

class TestCategoryController extends GenericController<EntityTarget<ObjectLiteral>> {
  constructor() {
    super(TestCategory);
  }

}

export const testCategoryController = new TestCategoryController();
