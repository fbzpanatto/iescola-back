import { DeepPartial, EntityTarget, ObjectLiteral } from "typeorm";

import { Request } from "express";
import { GenericController } from "./generic-controller";

import { Student } from "../entity/Student";
import { PersonClass } from "./person-controller";
import { Classroom } from "../entity/Classroom";
import { StudentTests } from "../entity/StudentTests";
import { Test } from "../entity/Test";

import { classroomController } from "./classroom-controller";
import { studentTestsController } from "./studentTests-controller";
import { testController } from "./test-controller";

class StudentController extends GenericController<EntityTarget<ObjectLiteral>> {
  constructor() {
    super(Student);
  }

  async linkStudentsWithTests(req: Request) {

    const studentsClass = await this.repository.find({ where: { classroom: { id: req.query.classroom } }}) as Student[];
    const test = await testController.findOneBy(req.query.test as string) as Test;

    for(let student of studentsClass) {

      const relation = await studentTestsController.findOne({ where: { student: { id: student.id }, test: { id: test.id } } })

      if (!relation) {

        const studentTest = new StudentTests()

        studentTest.student = student
        studentTest.test = test

        studentTest.studentAnswers = test.questions.map(q => {
          return { id: q.id, answer: '' }
        })

        await studentTestsController.saveData(studentTest)

        return
      }
    }

    let studentsTest = await studentTestsController.getAll({
      select: ['id', 'studentAnswers', 'completed'],
      relations: ['student', 'student.person'],
      where: {
        student: { classroom: { id: req.query.classroom } },
        test: { id: test.id },
      }
    })

    return {
      test: {
        id: test.id,
        questions: test.questions,
      },
      studentTests: studentsTest.map((st) => {
        return {
          id: st.id,
          student: {
            id: st.student.id,
            person: st.student.person,
            test: {
              answers: st.studentAnswers,
              completed: st.completed
            }
          },
        }
      })
    }
  }

  override async saveData(body: DeepPartial<ObjectLiteral>) {

    const student = new Student();
    student.person = await PersonClass.newPerson(body);
    student.ra = body.ra;

    if (body.classroom) {
      student.classroom = await classroomController.findOneBy(body.classroom.id) as Classroom;
    }

    return await student.save()
  }

}

export const studentController = new StudentController();
