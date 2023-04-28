import {GenericController} from "./generic-controller";
import {StudentTests} from "../entity/StudentTests";
import {DeepPartial, EntityTarget, ObjectLiteral} from "typeorm";
import {studentController} from "./student-controller";
import {Student} from "../entity/Student";
import {testController} from "./test-controller";
import {Test} from "../entity/Test";

class StudentTestsController extends GenericController<EntityTarget<ObjectLiteral>> {
  constructor() {
    super(StudentTests);
  }

  override async updateOneBy(id: string, body: DeepPartial<ObjectLiteral>) {

    const dataToUpdate = await this.findOneBy(id);
    const test = await testController.findOneBy(body.test.id) as Test;

    const student = await studentController.findOne({
      relations: ['classroom'],
      where: { id: body.student.id }
    }) as Student;

    if (!dataToUpdate) throw new Error('Data not found');

    for (const key in body) {
      dataToUpdate[key] = body[key];
    }

    dataToUpdate.score = body.studentAnswers.reduce((acc: number, curr: { id: number, answer: string }) => {
      const question = test.questions.find(q => q.id === Number(curr.id));
      if (question?.answer === curr.answer) acc++;
      return acc;
    }, 0)

    await this.repository.save(dataToUpdate)

    return this.totalByQuestion(test, student.classroom.id)
  }

  async totalByQuestion(test: Test, classroomId: number | string) {

    const studentsTestByClass = await this.repository.find({
      relations: ['student', 'student.classroom'],
      where: {
        test: {id: test.id},
        completed: true,
        student: {classroom: {id: classroomId}}
      }
    }) as StudentTests[]

    return test.questions.map(q => {
      return {
        id: q.id,
        total: studentsTestByClass.reduce((acc, curr) => {
          const answer = curr.studentAnswers.find(a => Number(a.id) === q.id);
          if (answer?.answer === q.answer) acc++;
          return acc;
        }, 0)
      }
    })
  }
}

export const studentTestsController = new StudentTestsController();
