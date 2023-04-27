import { GenericController } from "./generic-controller";
import { School } from "../entity/School";
import {DeepPartial, EntityTarget, ObjectLiteral} from "typeorm";

class SchoolController extends GenericController<EntityTarget<ObjectLiteral>> {
  constructor() {
    super(School);
  }

  async manyData(body: DeepPartial<ObjectLiteral>, options?: any) {

    for (let school of body['schools']) {
      await this.repository.save(school, options);
    }

    return await this.repository.save(body, options);
  }

}

export const schoolController = new SchoolController();
