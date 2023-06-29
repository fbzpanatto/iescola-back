import {DeepPartial, EntityTarget, FindOptionsWhere, ILike, In, IsNull, ObjectLiteral} from "typeorm";

import {Request} from "express";
import {GenericController} from "./genericController";

import {Student} from "../entity/Student";
import {PersonClass} from "./personController";
import {Classroom} from "../entity/Classroom";
import {StudentTests} from "../entity/StudentTests";
import {Test} from "../entity/Test";
import {StudentClassesHistory} from "../entity/StudentClassesHistory";

import {classroomController} from "./classroomController";
import {studentTestsController} from "./studentTestsController";
import {testController} from "./testController";
import {studentClassesHistoryController} from "./studentClassesHistoryController";
import {teacherController} from "./teacherController";
import {Teacher} from "../entity/Teacher";

class StudentController extends GenericController<EntityTarget<ObjectLiteral>> {
  constructor() {
    super(Student);
  }

  async getAllStudents(req: Request) {

    try {

      const { user: UserId } = req?.body.user

      const teacher = await teacherController.findOne({
        relations: ['person.user', 'teacherClasses.classroom.year'],
        where: { person: { user: { id: UserId } } }
      }) as Teacher

      const students = await this.repository.find({
        relations: [ 'person', 'classroom.school', 'classroom.year'],
        where: this.whereSearch(teacher, req)
      }) as Student[]

      let result = students.map(student => {
        return {
          id: student.id,
          order: student.no,
          name: student.person.name,
          classroom: student.classroom.name,
          school: student.classroom.school.name
        }
      })

      return { status: 200, data: result }

    } catch (error: any) {

      return  { status: 500, data: error }

    }

  }

  private whereSearch(teacher: Teacher, req?: Request):  FindOptionsWhere<ObjectLiteral> | FindOptionsWhere<ObjectLiteral>[] | undefined {

    let search: string = ''
    let year: number = 1

    if(req) {
      for(let value in req.query) {
        if(!!req.query[value]?.length && value === 'search') {
          search = req.query[value] as string
        }
        if(req.query.year) {
          year = Number(req?.query.year)
        }
      }
    }

    let classesIds = teacher.teacherClasses.map((teacherClass) => teacherClass.classroom.id)

    let fullSearch: FindOptionsWhere<ObjectLiteral> = {
      classroom: { id: In(classesIds), year: { id: year } },
    }

    let whereFilters: FindOptionsWhere<ObjectLiteral> = {
      person: { name: ILike(`%${search}%`) },
      classroom: { id: In(classesIds), year: { id: year } },
    }

    return search.length > 0 ? whereFilters : fullSearch
  }

  async getOneStudent(req: Request) {

    try {

      const student = await this.repository.findOne({
        relations: [ 'person', 'classroom.school', 'classroom.category', 'classroom.year'],
        where: { id: req.params.id }
      }) as Student

      let result = {
        id: student.id,
        order: student.no,
        name: student.person.name,
        birthDate: student.person.birthDate,
        classroom: {
          id: student.classroom.id,
          name: student.classroom.name,
          school: student.classroom.school.name,
          year: student.classroom.year.name,
          category: student.classroom.category.name,
        },
        ra: student.ra,
      }

      return { status: 200, data: result }

    } catch (error) {

      return { status: 500, data: error }

    }

  }

  override async saveData(body: DeepPartial<ObjectLiteral>) {

    try {

      const student = new Student();
      const classroom = await classroomController.findOneBy(Number(body.classroom.id)) as Classroom

      body.category = { id: 2 }

      const studentInDB = await this.repository.findOne({
        where: { ra: body.ra }
      }) as Student

      if(studentInDB) {
        return { status: 409, data: 'O RA informado já está em uso.' }
      }

      student.person = await PersonClass.newPerson(body);
      student.ra = body.ra;
      student.no = body.order;
      student.classroom = classroom
      await student.save()

      const studentClassroom = new StudentClassesHistory()
      studentClassroom.student = student
      studentClassroom.classroom = classroom
      studentClassroom.startedAt = body.startedAt ? body.startedAt : new Date()
      studentClassroom.active = true
      await studentClassesHistoryController.saveData(studentClassroom)

      return { status: 200, data: student }

    } catch (error: any) {

      return { status: 500, data: error }

    }

  }

  async updateOneStudent(id: number | string, body: DeepPartial<ObjectLiteral>) {

    try {

      const student = await this.repository.findOne({
        relations: ['classroom'],
        where: { id: Number(id) }
      }) as Student

      student.person.name = body.name;
      student.person.birthDate = body.birthDate;
      student.ra = body.ra;
      student.no = body.order;
      await student.save()

      if(body.classroom) {

        const newClassroom = await classroomController.findOneBy(Number(body.classroom.id)) as Classroom

        const register = await studentClassesHistoryController.findOne({
          relations: ['student', 'classroom'],
          where: { student: { id: student.id }, classroom: { id: student.classroom.id }, active: true, endedAt: null }
        }) as StudentClassesHistory

        await studentClassesHistoryController.updateOneBy(register.id, { endedAt: new Date(), active: false })

        student.classroom = newClassroom
        await student.save()

        const studentClassroom = new StudentClassesHistory()
        studentClassroom.student = student
        studentClassroom.classroom = newClassroom
        studentClassroom.startedAt = body.startedAt ? body.startedAt : new Date()
        studentClassroom.active = true
        await studentClassesHistoryController.saveData(studentClassroom)
      }

      return { status: 200, data: student }

    } catch (error) {

      return { status: 500, data: error }

    }
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

}

export const studentController = new StudentController();
