import { GenericController } from "./generic-controller";
import { Student } from "../entity/Student";
import { DeepPartial, EntityTarget, ObjectLiteral } from "typeorm";
import { classroomController } from "./classroom-controller";

class StudentController extends GenericController<EntityTarget<ObjectLiteral>> {
  constructor() {
    super(Student);
  }

  override async saveData(body: DeepPartial<ObjectLiteral>) {

    const classroom = await classroomController.findOneBy(body.classroom.id);

    if (!classroom) throw new Error('Classroom not found');

    body.classroom = classroom;

    return await this.repository.save(body);
  }

}

export const studentController = new StudentController();
