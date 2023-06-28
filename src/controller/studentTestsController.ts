import {GenericController} from "./genericController";
import {DeepPartial, EntityTarget, FindOneOptions, ObjectLiteral} from "typeorm";
import {Request} from "express";

import {Classroom} from "../entity/Classroom";
import {Student} from "../entity/Student";
import {StudentTests} from "../entity/StudentTests";
import {Test} from "../entity/Test";
import {TestClasses} from "../entity/TestClasses";


import {testController} from "./testController";
import {studentController} from "./studentController";
import {classroomController} from "./classroomController";
import {testClassesController} from "./testClassesController";
import {School} from "../entity/School";
import {studentClassesHistoryController} from "./studentClassesHistoryController";
import {StudentClassesHistory} from "../entity/StudentClassesHistory";

class StudentTestsController extends GenericController<EntityTarget<ObjectLiteral>> {
  constructor() {
    super(StudentTests);
  }

  async analyzes(req: Request | any) {

    const { test: testId, classroom: classId } = req.query

    const test = await testController.findOneBy(testId as string) as Test;
    const classroom = await classroomController.findOne({ relations: ['school'], where: { id: classId }}) as Classroom
    const { school } = classroom

    const testClasses = await testClassesController.getAll({
      relations: ['classroom.school'],
      where: { test: { id: test.id } }
    }) as TestClasses[]

    const arrayOfClasses = testClasses.map(result => result.classroom)

    let totaByClassroom: { [key: string]: { testDone: number, acertos: { id: number, totalAcerto: number }[], question: { id: number, rate: number }[], school: School, classroom: string }} = {}

    for(let classroom of arrayOfClasses) {
      if(!totaByClassroom[classroom.id]) {
        totaByClassroom[classroom.id] = {
          school: classroom.school,
          classroom: classroom.name,
          testDone: 0,
          acertos: [],
          question: []
        }
      }

      const studentTests = await studentTestsController.getAll({
        where: { test: { id: test.id }, registeredInClass: { id: classroom.id }, completed: true },
      }) as StudentTests[]

      totaByClassroom[classroom.id].testDone = studentTests.length

      for(let studentTest of studentTests) {
        for(let studentQuestion of studentTest.studentAnswers) {
          const questionIndex = test.questions.findIndex(testQuestion => testQuestion.id === studentQuestion.id)
          if(!totaByClassroom[classroom.id].acertos[questionIndex]) {
            totaByClassroom[classroom.id].acertos.push({ id: studentQuestion.id, totalAcerto: 0 })
          }

          const notEmpty = studentQuestion?.answer != ''

          const condition = test.questions[questionIndex].answer.includes(studentQuestion.answer)

          if(totaByClassroom[classroom.id].acertos[questionIndex] && (condition && notEmpty)) {
            totaByClassroom[classroom.id].acertos[questionIndex].totalAcerto += 1
          }
        }
      }
    }

    for(let classroom in totaByClassroom) {
      for(let question of totaByClassroom[classroom].acertos) {
        const index = totaByClassroom[classroom].question.findIndex(obj => obj.id === question.id)
        if(!totaByClassroom[classroom].question[index]) {
          totaByClassroom[classroom].question.push({ id: question.id, rate: Math.round((question.totalAcerto / totaByClassroom[classroom].testDone) * 100) })
        }
      }
    }

    const totalDoneMunicipio = Object.keys(totaByClassroom).reduce((acc: number, prev: string) => {
      let localvalue = totaByClassroom[prev].testDone
      return acc += localvalue
    }, 0)

    let municipio: { [key: string]: { classroom: string, testDone: number, question: { id: number, rate: number }[] } } = {
      'cityHall': {
        classroom: 'Municipio',
        testDone: totalDoneMunicipio,
        question: []
      }
    }

    for(let question of test.questions) {
      const index = municipio['cityHall'].question.findIndex(qt => qt.id === question.id)
      if(!municipio['cityHall'].question[index]) {

        let total:number = 0

        for(let classroom in totaByClassroom) {
          total += totaByClassroom[classroom].acertos.find(qt => qt.id === question.id)?.totalAcerto ?? 0
        }

        municipio['cityHall'].question.push({ id: question.id, rate: Math.round((total / municipio['cityHall'].testDone) * 100) })

      }
    }

    for(let register in totaByClassroom) {
      if(totaByClassroom[register].school.id != school.id) {
        delete totaByClassroom[register]
      }
    }

    return {
      ...municipio,
      ...totaByClassroom
    }
  }

  async registerAnswers(req: Request) {

    try {

      const { test: testId, classroom: classroomId } = req.query

      const test = await testController.findOneBy(testId as string) as Test;

      const classroomQuery:  FindOneOptions<ObjectLiteral> = {
        select: ['id', 'name', 'students'],
        relations: ['students', 'students.person', 'school'],
        where: { id: classroomId }
      }

      const classroom =  await classroomController.findOne(classroomQuery) as Classroom

      const studentsTests = await this.getAll({
        relations: ['student', 'test'],
        where: { test: { id: test.id }, registeredInClass: { id: classroom.id} }
      }) as StudentTests[]

      const students = studentsTests.map(register => register.student)

      await this.updateRelation(students, test)

      return await this.dataToFront(test, classroom)

    } catch (error: any) {

      console.log(error)

    }

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

    const { test, studentTest, registeredInClass, studentAnswers, completed,  } = body

    const testId = test.id
    const studentTestId = studentTest.id
    const registeredInClassId = registeredInClass.id

    const studentTestInDB = await this.findOne({
      relations: ['student', 'test', 'registeredInClass.school'],
      where: { id: studentTestId, test: { id: testId }, registeredInClass: { id: registeredInClassId } }
    }) as StudentTests;

    const testInDB = await testController.findOneBy(Number(testId)) as Test;

    studentTestInDB.completed = completed
    studentTestInDB.studentAnswers = studentAnswers.map((question: any) => {
      return { id: question.id, answer: question.answer.toUpperCase().trim() }
    });

    await this.repository.save(studentTestInDB)

    return this.dataToFront(testInDB, studentTestInDB.registeredInClass)
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
      relations: ['student.person', 'registeredInClass.school'],
      where: { test: {id: test.id}, registeredInClass: { id: classroom.id} }
    }) as StudentTests[]

    const studentsTestsCompleted = studentsTests.filter(st => st.completed)

    const totalByQuestion = test.questions.map(testQuestion => {
      return {
        id: testQuestion.id,
        total: studentsTestsCompleted.reduce((acc, curr) => {
          const studentQuestion = curr.studentAnswers.find(sa => Number(sa.id) === testQuestion.id);

          const notEmpty = studentQuestion?.answer != ''

          const condition = testQuestion.answer.includes(studentQuestion?.answer as string)

          if (condition && notEmpty) acc++;
          return acc;
        }, 0)
      }
    })

    const rateByQuestion = totalByQuestion.map(q => {
      return {
        id: q.id,
        rate: `${Math.round((q.total / studentsTestsCompleted.length) * 100)}`
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
        test: {
          answers: st.studentAnswers,
          completed: st.completed,
          score: st.studentAnswers.reduce((acc, studentQuestion) => {
            const testQuestion = test.questions.find(q => q.id === Number(studentQuestion.id));

            const notEmpty = studentQuestion?.answer != ''

            const condition = testQuestion?.answer.includes(studentQuestion.answer)

            if (condition && notEmpty) acc++;
            return acc;
          }, 0)
        }
      },
    }
  }
}

export const studentTestsController = new StudentTestsController();
