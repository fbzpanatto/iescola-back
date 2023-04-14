import { GenericController } from "./generic-controller";
import { Bimester } from "../entity/Bimester";
import { EntityTarget, ObjectLiteral } from "typeorm";

class BimesterController extends GenericController<EntityTarget<ObjectLiteral>> {
  constructor() {
    super(Bimester);
  }

}

export const bimesterController = new BimesterController();
