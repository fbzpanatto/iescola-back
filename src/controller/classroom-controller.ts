import { GenericController } from "./generic-controller";
import { Classroom } from "../entity/Classroom";
import { DeepPartial, EntityTarget, ObjectLiteral } from "typeorm";
import { schoolController } from "./school-controller";

class ClassroomController extends GenericController<EntityTarget<ObjectLiteral>> {
  constructor() {
    super(Classroom);
  }

  override async getAll() {

    return await this.repository.find({ relations: ['school'] });
  }

  override async saveData(body: DeepPartial<ObjectLiteral>) {

    const school = await schoolController.findOneBy(body.school.id);

    if (!school) throw new Error('School not found');

    body.school = school;

    return await this.repository.save(body);
  }

}

export const classroomController = new ClassroomController();
