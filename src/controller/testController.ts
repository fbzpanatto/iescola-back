import {DeepPartial, EntityTarget, ObjectLiteral, ILike, FindOptionsWhere} from "typeorm";
import { GenericController } from "./genericController";
import {query, Request} from "express";

import { Classroom } from "../entity/Classroom";
import { TestClasses } from "../entity/TestClasses";
import { StudentTests } from "../entity/StudentTests";
import { Test } from "../entity/Test";

import { testClassesController } from "./testClassesController";
import { classroomController } from "./classroomController";
import { studentTestsController} from "./studentTestsController";

interface TestClass {name: string, school: string, classroomId: number, classroom: string, year: number, bimester: string, category: string, teacher: string, discipline: string}

class TestController extends GenericController<EntityTarget<ObjectLiteral>> {

  constructor() {
    super(Test);
  }

  async getAllWithTerm(req?: Request) {

    let response: { testId: number, classes: TestClass[] }[] = []

    const tests = await this.repository.find({
      relations: ['discipline', 'category', 'bimester', 'year', 'teacher.person', 'testClasses.classroom.school'],
      select: ['id', 'name'],
      where: this.whereSearch(req)
    }) as Test[]

    for (let test of tests) {

      let testClasses: TestClass[] = []

      for(let testClass of test.testClasses) {
        let data = {
          name: test.name,
          school: testClass.classroom.school.name,
          classroomId: testClass.classroom.id,
          classroom: testClass.classroom.name,
          year: test.year.name,
          bimester: test.bimester.name,
          category: test.category.name,
          teacher: test.teacher.person.name,
          discipline: test.discipline.name,
        }
        testClasses.push(data)
      }
      response.push({ testId: test.id, classes: testClasses })
    }
    return response
  }

  whereSearch(req?: Request):  FindOptionsWhere<ObjectLiteral> | FindOptionsWhere<ObjectLiteral>[] | undefined {

    let search: string = ''
    if(req) {
      for(let value in req.query) {
        if(!!req.query[value]?.length) {
          search = req.query[value] as string
        }
      }
    }

    let fullSearch = {}
    let textSearch = { testClasses: { classroom: { school: { name: ILike(`%${search}%`) } } } }
    return search.length > 0 ? textSearch : fullSearch
  }

  async getOne(id: number | string) {

    const test = await this.repository.findOne({
      relations: ['discipline', 'category', 'bimester', 'year', 'teacher.person', 'teacher.teacherClasses', 'teacher.teacherDisciplines', 'testClasses.classroom.school'],
      where: { id: Number(id) },
    }) as Test

    let testClasses = test.testClasses
      .map((testClass) => { return { id: testClass.classroom.id, name: testClass.classroom.name }})
      .sort((a, b) => a.id - b.id)

    let teacherClasses = test.teacher
      .teacherClasses
      .map((classroom) => { return { id: classroom.classroom.id, name: classroom.classroom.name }})
      .sort((a, b) => a.id - b.id)

    let teacherDisciplines = test.teacher
      .teacherDisciplines
      .map((discipline) => { return { id: discipline.discipline.id,  name: discipline.discipline.name }})
      .sort((a, b) => a.id - b.id)

    return {
      ...test,
      teacher: {
        id: test.teacher.id,
        person: test.teacher.person,
        classes: teacherClasses,
        disciplines: teacherDisciplines,
      },
      testClasses: testClasses,
    }
  }

  override async saveData(body: DeepPartial<ObjectLiteral>) {

    const test = new Test()

    test.name = body.name;
    test.questions = body.questions;
    test.active = body.active;
    test.year = body.year
    test.bimester = body.bimester
    test.teacher = body.teacher
    test.discipline = body.discipline
    test.category = body.category

    await this.repository.save(test)

    if(body.testClasses) {

      for (let classId of body.testClasses) {
        const classroom = await classroomController.findOneBy(classId) as Classroom;
        const testClasses = new TestClasses()

        testClasses.classroom = classroom
        testClasses.test = test

        await testClassesController.saveData(testClasses)
      }
    }

    return await this.repository.save(test)
  }

  override async updateOneBy (id: string, body: DeepPartial<ObjectLiteral>) {

    const test = await this.findOneBy(id) as Test;

    if(body.removeQuestion) {

      const index = test.questions.findIndex((question: { id: number, answer: string }) => Number(question.id) === Number(body.removeQuestion))
      test.questions.splice(index, 1)

      for(let question of test.questions) {
        if(question.id > body.removeQuestion) {
          question.id -= 1
        }
      }

      // adjust student tests
      const studentsTests = await studentTestsController.getAll({
        relations: ['student'],
        where: { test: { id: test.id }}
      }) as StudentTests[]

      for(let studentTest of studentsTests) {
        let answers = studentTest.studentAnswers
        answers.splice(index, 1)
        for(let answer of answers) {
          if(answer.id > body.removeQuestion) {
            answer.id -= 1
          }
        }
        studentTest.studentAnswers = answers
        await studentTestsController.saveData(studentTest)
      }
    }

    if(body.questions) {

      const condition = test.questions.length === body.questions.length

      if(!condition && (body.questions.length > test.questions.length)) {

        let newQuestions = body.questions.filter((question: { id: number, answer: string }) => {
          const index = test.questions.findIndex(q => Number(q.id) === Number(question.id))
          const element = !!test.questions[index]
          if(!element) {
            return question
          }
        }) as { id: number, answer: string }[]
        this.addNewQuestions(test, newQuestions)
      }
      test.questions = body.questions
    }

    return await this.repository.save(test);
  }

  async addNewQuestions(test: Test, questions: { id: number, answer: string }[]) {

    let newQuestions = questions.map(q => { return { id: q.id, answer: '' } })

    const studentsTests = await studentTestsController.getAll({
      relations: ['student'],
      where: { test: { id: test.id }}
    }) as StudentTests[]

    for(let studentTest of studentsTests) {
      for(let question of newQuestions) {
        studentTest.studentAnswers.push(question)
      }
      await studentTestsController.saveData(studentTest)
    }
  }

}

export const testController = new TestController();
