import {GenericController} from "./generic-controller";
import {StudentTests} from "../entity/StudentTests";
import {DeepPartial, EntityTarget, ObjectLiteral} from "typeorm";
import {classroomController} from "./classroom-controller";
import {Classroom} from "../entity/Classroom";
import {studentController} from "./student-controller";
import {Student} from "../entity/Student";

class StudentTestsController extends GenericController<EntityTarget<ObjectLiteral>> {
  constructor() {
    super(StudentTests);
  }

  override async updateOneBy(id: string, body: DeepPartial<ObjectLiteral>) {

    const dataToUpdate = await this.findOneBy(id);
    const student = await studentController.findOne({
      relations: ['classroom'],
      where: { id: body.student.id }
    }) as Student;

    if (!dataToUpdate) throw new Error('Data not found');

    for (const key in body) {
      dataToUpdate[key] = body[key];
    }

    await this.repository.save(dataToUpdate)

    return await this.repository.count({
      relations: ['student', 'student.classroom'],
      where: {
        test: {id: body.test.id},
        completed: true,
        student: {classroom: {id: student.classroom.id}}
      }
    })
  }
}

export const studentTestsController = new StudentTestsController();
