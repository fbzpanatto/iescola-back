import { GenericController } from "./genericController";
import { Category } from "../entity/Category";
import { EntityTarget, ObjectLiteral } from "typeorm";

class CategoryController extends GenericController<EntityTarget<ObjectLiteral>> {
  constructor() {
    super(Category);
  }

}

export const categoryController = new CategoryController();
