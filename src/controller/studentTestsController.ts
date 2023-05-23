import { GenericController } from "./genericController";
import { DeepPartial, EntityTarget, FindOneOptions, ObjectLiteral} from "typeorm";
import { Request } from "express";

import { Classroom } from "../entity/Classroom";
import { Student } from "../entity/Student";
import { StudentTests } from "../entity/StudentTests";
import { Test } from "../entity/Test";
import { TestClasses } from "../entity/TestClasses";


import { testController } from "./testController";
import { studentController } from "./studentController";
import { classroomController } from "./classroomController";
import { testClassesController } from "./testClassesController";

class StudentTestsController extends GenericController<EntityTarget<ObjectLiteral>> {
  constructor() {
    super(StudentTests);
  }

  async analyzes(req: Request) {

    const { test: testId, classroom: classroomId } = req.query

    const test = await testController.findOneBy(testId as string) as Test;

    const classroomQuery:  FindOneOptions<ObjectLiteral> = { relations: ['school'], where: { id: classroomId }}
    const classroom = await classroomController.findOne(classroomQuery) as Classroom;
    const school = classroom.school

    const classesQuery: FindOneOptions<ObjectLiteral> = {
      relations: ['classroom', 'classroom.students.studentTests'],
      where: { test: { id: test.id }, classroom: { school: { id: school.id } } }
    }
    const testClasses = await testClassesController.getAll(classesQuery) as TestClasses[]

    const respose:{ classroom?: string, questions: { id: number, total: number }[], testDone?: any, ratePerQuestion?: any }[] = []

    for(let testClass of testClasses) {
      let obj: { classroom?: string, questions: { id: number, total: number }[], testDone?: any, ratePerQuestion?: any } = {
        classroom: testClass.classroom.name,
        questions: [],
        testDone: testClass.classroom.students.filter((student: Student) => student.studentTests.find((st: StudentTests) => st.testId === test.id && st.completed)).length
      }

      for(let question of test.questions) {
        let questionObj = { id: question.id, total: 0 }

        for(let student of testClass.classroom.students) {

          student.studentTests.filter((st: StudentTests) => (st.testId === test.id && st.completed)).map((st: StudentTests) => {

            const index = question.id
            const answer = st.studentAnswers.find((answer: { id: number }) => answer.id === index)

            if(answer) {
              if(answer.answer === question.answer) {
                questionObj.total += 1
              }
            }
          })
        }
        obj.questions.push(questionObj)
      }
      obj.ratePerQuestion = obj.questions.map((q: any) => {

        return { id: q.id, rate: Math.floor((q.total / obj.testDone) * 100)}
      })
      respose.push(obj)
    }
    return respose
  }

  async registerAnswers(req: Request) {

    const { test: testId, classroom: classroomId } = req.query

    const test = await testController.findOneBy(testId as string) as Test;

    const classroomQuery:  FindOneOptions<ObjectLiteral> = {
      select: ['id', 'name', 'students'],
      relations: ['students', 'students.person', 'school'],
      where: { id: classroomId }
    }

    const classroom =  await classroomController.findOne(classroomQuery) as Classroom

    const students = classroom.students

    await this.updateRelation(students, test)

    return await this.dataToFront(test, classroom)
  }

  private async updateRelation( students: Student[], test: Test ) {

    let notCompletedCounter = 0

    for(let student of students) {

      const query: FindOneOptions<ObjectLiteral> = { where: { student: { id: student.id }, test: { id: test.id } } }

      const studentTest = await this.repository.findOne(query) as StudentTests

      if (!studentTest) {
        const newStudentTest = new StudentTests()

        newStudentTest.student = student
        newStudentTest.test = test
        newStudentTest.completed = false
        newStudentTest.studentAnswers = test.questions.map(q => { return { id: q.id, answer: '' } })

        await studentTestsController.saveData(newStudentTest)

      } else {
        const notCompleted = studentTest.studentAnswers.every((answer) => answer.answer === '')

        if (!notCompleted) {
          studentTest.completed = true
          await studentTestsController.saveData(studentTest)

        } else {
          notCompletedCounter++
        }
      }
    }
  }

  override async updateOneBy(id: string, body: DeepPartial<ObjectLiteral>) {

    const dataToUpdate = await this.findOneBy(id);
    const test = await testController.findOneBy(body.test.id) as Test;

    const student = await studentController.findOne({
      relations: ['classroom', 'classroom.school'],
      where: { id: body.student.id }
    }) as Student;

    if (!dataToUpdate) throw new Error('Data not found');

    for (const key in body) {
      dataToUpdate[key] = body[key];
    }

    await this.repository.save(dataToUpdate)

    return this.dataToFront(test, student.classroom)
  }

  async dataToFront(test: Test, classroom: Classroom) {

    const testClassroom = await testClassesController.findOne({
      relations: ['testGiver.person'],
      where: { test: {id: test.id}, classroom: {id: classroom.id}}
    }) as TestClasses

    let testGiver = {
      id: testClassroom.testGiver?.id,
      person: testClassroom.testGiver?.person.name
    }

    const studentsTests = await this.repository.find({
      relations: ['student', 'student.classroom'],
      where: { test: {id: test.id}, student: {classroom: {id: classroom.id}} }
    }) as StudentTests[]

    const studentsTestsCompleted = studentsTests.filter(st => st.completed)

    const totalByQuestion = test.questions.map(q => {
      return {
        id: q.id,
        total: studentsTestsCompleted.reduce((acc, curr) => {
          const answer = curr.studentAnswers.find(a => Number(a.id) === q.id);
          if (answer?.answer === q.answer) acc++;
          return acc;
        }, 0)
      }
    })

    const rateByQuestion = totalByQuestion.map(q => {
      return {
        id: q.id,
        rate: `${Math.floor((q.total / studentsTestsCompleted.length) * 100)}`
      }
    })

    return {
      test: { id: test.id, questions: test.questions },
      classroom: { id: classroom.id, name: classroom.name, school: classroom.school.name },
      studentTests: studentsTests.map(st => this.formatStudentTest(st, test)),
      totalTestCompleted: studentsTestsCompleted.length,
      totalByQuestion: totalByQuestion,
      rateByQuestion: rateByQuestion,
      testGiver: testGiver
    }
  }

  private formatStudentTest = (st: StudentTests, test: Test) => {
    return {
      id: st.id,
      student: {
        id: st.student.id,
        no: st.student.no,
        person: st.student.person,
        classroom: st.student.classroom.id,
        test: {
          answers: st.studentAnswers,
          completed: st.completed,
          score: st.studentAnswers.reduce((acc, curr) => {
            const question = test.questions.find(q => q.id === Number(curr.id));
            if (question?.answer === curr.answer) acc++;
            return acc;
          }, 0)
        }
      },
    }
  }
}

export const studentTestsController = new StudentTestsController();
