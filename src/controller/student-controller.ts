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
import {StudentClasses} from "../entity/StudentClasses";
import {studentClassesController} from "./studentClasses-controller";

class StudentController extends GenericController<EntityTarget<ObjectLiteral>> {
  constructor() {
    super(Student);
  }

  async testCreation(){
    const localDataToSave = require('../sheets/agenor/agenor_5a_matematica.json')

    const myArrayToSave: { [key: number | string]: any }[] = []

    for(let register of localDataToSave) {

      const questions = Object.keys(register).filter(key => !isNaN(Number(key)))
          .map(questionId => {

            let object: { [key: number | string]: any } = {}
            object.id = questionId
            object.answer = register[questionId]

            return object
          })

      myArrayToSave.push({
        questions: questions,
        name: register.name,
        classroom: register['class'],
        test: register.test,
        category: register.category,
        no: register.no
      })

    }

    for(let newElement of myArrayToSave) {

      const student = new Student();
      student.person = await PersonClass.newPerson({ name: newElement.name, category: { id: newElement.category } });
      student.no = newElement.no
      await student.save()

      const studentClassroom = new StudentClasses()
      studentClassroom.student = student
      studentClassroom.classroom = await classroomController.findOneBy(newElement.classroom) as Classroom
      await studentClassesController.saveData(studentClassroom)

      const studentTest = new StudentTests()
      studentTest.student = student
      studentTest.test = await testController.findOneBy(newElement.test) as Test
      studentTest.studentAnswers = newElement.questions
      await studentTestsController.saveData(studentTest)
    }

    return 'ok'
  }

  async linkStudentsWithTests(req: Request) {

    const studentsClass = await studentClassesController.getAll({
      relations: ['student', 'student.person', 'classroom', 'classroom.testClasses'],
      where: {
        classroom: { id: req.query.classroom},
      }
    }) as StudentClasses[];

    const test = await testController.findOneBy(req.query.test as string) as Test;

    const students = studentsClass.map(studentClass => studentClass.student)

    for(let student of students) {

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

    await student.save()

    if (body.classroom) {
      const studentClassroom = new StudentClasses()
      studentClassroom.student = student
      studentClassroom.classroom = await classroomController.findOneBy(body.classroom.id) as Classroom

      await studentClassesController.saveData(studentClassroom)
    }

    return await student.save()
  }

}

export const studentController = new StudentController();
