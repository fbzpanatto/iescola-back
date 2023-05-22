import { GenericController } from "./genericController";
import { DeepPartial, EntityTarget, FindOneOptions, ObjectLiteral} from "typeorm";
import { Request } from "express";

import { Classroom } from "../entity/Classroom";
import { Student } from "../entity/Student";
import { StudentTests } from "../entity/StudentTests";
import { Test } from "../entity/Test";

import { testController } from "./testController";
import { studentController } from "./studentController";
import { classroomController } from "./classroomController";
import {testClassesController} from "./testClassesController";
import {TestClasses} from "../entity/TestClasses";

class StudentTestsController extends GenericController<EntityTarget<ObjectLiteral>> {
  constructor() {
    super(StudentTests);
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
      relations: ['classroom'],
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
      relations: ['testGiver'],
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
