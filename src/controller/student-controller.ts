import { DeepPartial, EntityTarget, ObjectLiteral } from "typeorm";

import { Request } from "express";
import { GenericController } from "./generic-controller";

import { Student } from "../entity/Student";
import { PersonClass } from "./person-controller";
import { Classroom } from "../entity/Classroom";
import { StudentTests } from "../entity/StudentTests";
import { Test } from "../entity/Test";
import { StudentClassesHistory} from "../entity/StudentClassesHistory";

import { classroomController } from "./classroom-controller";
import { studentTestsController } from "./studentTests-controller";
import { testController } from "./test-controller";
import { studentClassesHistoryController } from "./student-classes-history-controller";

class StudentController extends GenericController<EntityTarget<ObjectLiteral>> {
  constructor() {
    super(Student);
  }

  async testCreation(){

    const runTimeClassExecution = ['5A', '5B', '5C', '9A', '9B', '9C']
    const runTimeSchool = 'agenor'
    const runTimeSubject = 'matematica'

    for(let classroom of runTimeClassExecution) {

      const localDataToSave = require(`../sheets/${runTimeSchool}/${runTimeSchool}_${classroom}_${runTimeSubject}.json`)

      const myArrayToSave: { [key: number | string]: any }[] = []

      for(let register of localDataToSave) {

        const questions = Object.keys(register).filter(key => !isNaN(Number(key)))
          .map(questionId => {

            let object: { [key: number | string]: any } = {}
            object.id = questionId

            if(object.answer === 'undefined' || object.answer === '-') {
              object.answer = ''
            } else {
              object.answer = register[questionId].toUpperCase()
            }

            return object
          })

        let completed: boolean = Number(register.completed) === 1

        myArrayToSave.push({
          questions: questions,
          name: register.name,
          classroom: register['class'],
          test: register.test,
          category: register.category,
          no: register.no,
          completed: completed
        })

      }

      for(let newElement of myArrayToSave) {

        const student = new Student();
        student.person = await PersonClass.newPerson({ name: newElement.name, category: { id: newElement.category } });
        student.no = newElement.no
        student.classroom = await classroomController.findOneBy(newElement.classroom) as Classroom

        await student.save()

        const studentClassroom = new StudentClassesHistory()
        studentClassroom.student = student
        studentClassroom.classroom = await classroomController.findOneBy(newElement.classroom) as Classroom
        await studentClassesHistoryController.saveData(studentClassroom)

        const studentTest = new StudentTests()
        studentTest.student = student
        studentTest.test = await testController.findOneBy(newElement.test) as Test
        studentTest.completed = newElement.completed
        studentTest.studentAnswers = newElement.questions
        await studentTestsController.saveData(studentTest)
      }

    }

    return 'ok'
  }

  async linkStudentsWithTests(req: Request) {

    const studentsClass = await studentClassesHistoryController.getAll({
      relations: ['student', 'student.person', 'classroom', 'classroom.testClasses'],
      where: {
        classroom: { id: req.query.classroom},
      }
    }) as StudentClassesHistory[];

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
      relations: ['student', 'student.person', 'student.classroom'],
      where: {
        test: { id: test.id },
        student: { classroom: { id: req.query.classroom }}
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
            no: st.student.no,
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
      const studentClassroom = new StudentClassesHistory()
      studentClassroom.student = student
      studentClassroom.classroom = await classroomController.findOneBy(body.classroom.id) as Classroom

      await studentClassesHistoryController.saveData(studentClassroom)
    }

    return await student.save()
  }

}

export const studentController = new StudentController();
