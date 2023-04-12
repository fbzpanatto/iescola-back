import { GenericController } from "./generic-controller";
import { School } from "../entity/School";

class SchoolController extends GenericController<School> {
  constructor() {
    super(School);
  }

}

export const schoolController = new SchoolController();
