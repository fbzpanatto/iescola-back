import { GenericController } from "./generic-controller";
import { Classroom } from "../entity/Classroom";
import { DeepPartial, EntityTarget, ObjectLiteral } from "typeorm";
import { schoolController } from "./school-controller";
import { yearController } from "./year-controller";

class ClassroomController extends GenericController<EntityTarget<ObjectLiteral>> {
  constructor() {
    super(Classroom);
  }

  override async saveData(body: DeepPartial<ObjectLiteral>) {

    const school = await schoolController.findOneBy(body.school.id);
    const year = await yearController.findOneBy(body.year.id);

    if (!school) throw new Error('School not found');
    if (!year) throw new Error('Year not found');

    body.school = school;
    body.year = year;

    return await this.repository.save(body);
  }

}

export const classroomController = new ClassroomController();
