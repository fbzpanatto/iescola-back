import { GenericController } from "./generic-controller";
import { StudentTests } from "../entity/StudentTests";
import { DeepPartial, EntityTarget, ObjectLiteral } from "typeorm";

import { studentController } from "./student-controller";
import { testController } from "./test-controller";

class StudentGradeTestController extends GenericController<EntityTarget<ObjectLiteral>> {
  constructor() {
    super(StudentTests);
  }

  override async saveData(body: DeepPartial<ObjectLiteral>) {

    const student = await studentController.findOneBy(body.student.id);
    const test = await testController.findOneBy(body.test.id);

    if (!student) throw new Error('Student not found');
    if (!test) throw new Error('Test not found');

    body.student = student;
    body.test = test;

    return await this.repository.save(body);
  }

}

export const studentGradeTestController = new StudentGradeTestController();
