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

    const totalByQuestion = test.questions.map(q => {
      return {
        id: q.id,
        total: studentsTestByClass.reduce((acc, curr) => {
          const answer = curr.studentAnswers.find(a => Number(a.id) === q.id);
          if (answer?.answer === q.answer) acc++;
          return acc;
        }, 0)
      }
    })

    const rateByQuestion = totalByQuestion.map(q => {
      return {
        id: q.id,
        rate: `${Math.floor((q.total / studentsTestByClass.length) * 100)}%`
      }
    })

    return {
      totalTestCompleted: studentsTestByClass.length,
      totalByQuestion: totalByQuestion,
      rateByQuestion: rateByQuestion
    }
  }
}

export const studentTestsController = new StudentTestsController();
