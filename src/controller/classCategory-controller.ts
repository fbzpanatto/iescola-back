import { GenericController } from "./generic-controller";
import { EntityTarget, ObjectLiteral } from "typeorm";
import { ClassCategory } from "../entity/ClassCategory";

class ClassCategoryController extends GenericController<EntityTarget<ObjectLiteral>> {
  constructor() {
    super(ClassCategory);
  }

}

export const classCategoryController = new ClassCategoryController();
