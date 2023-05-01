import { DeepPartial, EntityTarget, FindOneOptions, ObjectLiteral } from "typeorm";

import { Request } from "express";
import { GenericController } from "./generic-controller";

import { Student } from "../entity/Student";
import { PersonClass } from "./person-controller";
import { Classroom } from "../entity/Classroom";
import { StudentTests } from "../entity/StudentTests";
import { Test } from "../entity/Test";
import { StudentClassesHistory } from "../entity/StudentClassesHistory";

import { classroomController} from "./classroom-controller";
import { studentTestsController} from "./studentTests-controller";
import { testController} from "./test-controller";
import { studentClassesHistoryController} from "./student-classes-history-controller";

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

  async registerAnswers(req: Request) {

    const { test: testId, classroom: classroomId } = req.query

    const test = await testController.findOneBy(testId as string) as Test;

    const classroomQuery:  FindOneOptions<ObjectLiteral> = {
      select: ['id', 'name', 'students'],
      relations: ['students', 'students.person'],
      where: { id: classroomId }
    }

    const { students } =  await classroomController.findOne(classroomQuery) as Classroom

    await this.updateRelation(students, test)

    return await this.dataToFront(test, classroomId as string)
  }

  private async updateRelation( students: Student[], test: Test ) {

    let notCompletedCounter = 0

    for(let student of students) {

      const query: FindOneOptions<ObjectLiteral> = { where: { student: { id: student.id }, test: { id: test.id } } }

      const studentTest = await studentTestsController.findOne(query) as StudentTests

      if (!studentTest) {
        const studentTest = new StudentTests()

        studentTest.student = student
        studentTest.test = test
        studentTest.completed = false

        studentTest.studentAnswers = test.questions.map(q => { return { id: q.id, answer: '' } })

        await studentTestsController.saveData(studentTest)

        return
      }

      const notCompleted = studentTest.studentAnswers.every((answer) => answer.answer === '')

      if (!notCompleted) {
        studentTest.completed = true
        await studentTestsController.saveData(studentTest)

      } else {
        notCompletedCounter++
      }
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

  async dataToFront(test: Test, classroomId: number | string) {
    return await studentTestsController.dataToFront(test, classroomId)
  }

}

export const studentController = new StudentController();
