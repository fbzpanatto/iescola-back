import { GenericController } from "./generic-controller";
import { Person } from "../entity/Person";
import { DeepPartial, EntityTarget, ObjectLiteral } from "typeorm";
import { classroomController } from "./classroom-controller";

class PersonController extends GenericController<EntityTarget<ObjectLiteral>> {
  constructor() {
    super(Person);
  }

  override async saveData(body: DeepPartial<ObjectLiteral>) {

    const { name, ra, classroom } = body


    // const classroom = await classroomController.findOneBy(body.classroom.id);

    // if (!classroom) throw new Error('Classroom not found');

    // body.classroom = classroom;

    return await this.repository.save(body);
  }

}

export const personController = new PersonController();
