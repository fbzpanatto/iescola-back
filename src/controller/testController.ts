import { DeepPartial, EntityTarget, ObjectLiteral, ILike, FindOptionsWhere, In } from "typeorm";
import { GenericController } from "./genericController";
import { Request} from "express";

import { Classroom } from "../entity/Classroom";
import { TestClasses } from "../entity/TestClasses";
import { StudentTests } from "../entity/StudentTests";
import { Test } from "../entity/Test";
import { Teacher } from "../entity/Teacher";

import { testClassesController } from "./testClassesController";
import { classroomController } from "./classroomController";
import { studentTestsController} from "./studentTestsController";
import { teacherController } from "./teacherController";

import { enumOfTeacherCategories} from "../middleware/isTeacher";


interface MyTestClassInterface {name: string, school: string, classroomId: number, classroom: string, year: number, bimester: string, category: string, teacher: string, discipline: string}

class TestController extends GenericController<EntityTarget<ObjectLiteral>> {

  constructor() {
    super(Test);
  }

  async getAllWithTerm(req?: Request) {

    try {

      let response: { testId: number, classes: MyTestClassInterface[] }[] = []

      const { user: UserId } = req?.body.user

      const teacher = await teacherController.findOne({
        relations: ['person.user', 'teacherClasses.classroom', 'teacherDisciplines.discipline'],
        where: { person: { user: { id: UserId } } }
      }) as Teacher

      let tests = await this.repository.find({
        relations: ['discipline', 'category', 'bimester', 'year', 'teacher.person.user', 'teacher.teacherClasses', 'testClasses.classroom.school'],
        select: ['id', 'name'],
        where: this.whereSearch(teacher, req)
      }) as Test[]

      for (let test of tests) {

        let testClasses: MyTestClassInterface[] = []

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

      return { status: 200, data: response}

    } catch (error) {
      return  { status: 500, data: error }
    }

  }

  whereSearch(teacher: Teacher, req?: Request):  FindOptionsWhere<ObjectLiteral> | FindOptionsWhere<ObjectLiteral>[] | undefined {

    let search: string = ''
    let bimester: number = 1
    let year: number = 1

    if(req) {
      for(let value in req.query) {
        if(!!req.query[value]?.length && value === 'search') {
          search = req.query[value] as string
        }
        if(req.query.bimester) {
          bimester = Number(req?.query.bimester)
        }
        if(req.query.year) {
          year = Number(req?.query.year)
        }
      }
    }

    let classesIds = teacher.teacherClasses.map((teacherClass) => teacherClass.classroom.id)
    let disciplinesIds = teacher.teacherDisciplines.map((teacherDiscipline) => teacherDiscipline.discipline.id)

    let fullSearch: FindOptionsWhere<ObjectLiteral> = {
      bimester: { id: bimester },
      year: { id: year }
    }

    let whereFilters: FindOptionsWhere<ObjectLiteral> = {
      testClasses: { classroom: { school: { name: ILike(`%${search}%`) } } },
      bimester: { id: bimester },
      year: { id: year }
    }

    if(Number(req?.body.user.category) === enumOfTeacherCategories.teacher){
      fullSearch = {
        testClasses: {
          classroom: {
            id: In(classesIds),
            school: { name: ILike(`%${search}%`) }
          },
        },
        bimester: { id: bimester },
        year: { id: year },
        teacher: { id: In([teacher.id, 1]) },
        discipline: { id: In(disciplinesIds) }
      }

      whereFilters = {
        testClasses: {
          classroom: {
            id: In(classesIds),
            school: { name: ILike(`%${search}%`) }
          },
        },
        bimester: { id: bimester },
        year: { id: year },
        teacher: { id: In([teacher.id, 1]) },
        discipline: { id: In(disciplinesIds) }
      }
    }

    return search.length > 0 ? whereFilters : fullSearch
  }

  async getOne(req: Request) {

    const id = req.params.id

    try {

      const test = await this.repository.findOne({
        relations: ['discipline', 'category', 'bimester', 'year', 'teacher.person.user', 'teacher.teacherClasses', 'teacher.teacherDisciplines', 'testClasses.classroom.school'],
        where: { id: Number(id) },
      }) as Test

      if(!this.isOwner(req, test)) {
        throw new Error('Test not found or you do not have permission to access it!')
      }

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

      let responseData = {
        ...test,
        teacher: {
          id: test.teacher.id,
          person: test.teacher.person,
          classes: teacherClasses,
          disciplines: teacherDisciplines,
        },
        testClasses: testClasses,
      }

      return { status: 200, data: responseData }

    } catch (error: any) {

      return { status: 403, data: error.message }
    }
  }

  override async saveData(body: DeepPartial<ObjectLiteral>) {

    try {

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

          const classroom = await classroomController.findOne({
            relations: ['students'],
            where: { id: Number(classId) },
          }) as Classroom;

          if(classroom.students.length > 0) {

            for(let student of classroom.students) {

              const newStudentTest = new StudentTests()

              newStudentTest.student = student
              newStudentTest.test = test
              newStudentTest.completed = false
              newStudentTest.registeredInClass = classroom
              newStudentTest.studentAnswers = test.questions.map(q => { return { id: q.id, answer: '' } })

              await studentTestsController.saveData(newStudentTest)
            }

          }

          const testClasses = new TestClasses()

          testClasses.classroom = classroom
          testClasses.test = test

          await testClassesController.saveData(testClasses)
        }
      }

      let response = await this.repository.save(test)

      return { status: 200, data: response }

    } catch (error: any) {

      return { status: 500, data: error.message }

    }

  }

  override async updateOneBy (id: string, body: DeepPartial<ObjectLiteral>) {

    try {

      const test = await this.findOneBy(id) as Test;

      if(body.removeQuestion) {

        const index = test.questions.findIndex((question: { id: number, answer: string }) => Number(question.id) === Number(body.removeQuestion))

        if(index === -1) {
          return { status: 404, data: 'Descartando alterações' }
        }

        test.questions.splice(index, 1)

        for(let question of test.questions) {
          if(question.id > body.removeQuestion) {
            question.id -= 1
          }
        }

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

      let response = await this.repository.save(test)

      return { status: 200, data: response }

    } catch (error: any) {

      return { status: 500, data: error.message }

    }

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

  isOwner(req: Request, test: Test) {

    const loggedUser = req.body.user
    const teacherPersonUser = test.teacher.person.user

    return !(Number(loggedUser.category) === enumOfTeacherCategories.teacher && loggedUser.user !== teacherPersonUser.id);
  }
}

export const testController = new TestController();
