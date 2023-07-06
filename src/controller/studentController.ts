import {DeepPartial, EntityTarget, FindOptionsWhere, ILike, In, IsNull, ObjectLiteral} from "typeorm";

import {Request} from "express";
import {GenericController} from "./genericController";

import {Student} from "../entity/Student";
import {PersonClass} from "./personController";
import {Classroom} from "../entity/Classroom";
import {StudentClassesHistory} from "../entity/StudentClassesHistory";

import {classroomController} from "./classroomController";
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
        relations: [ 'person', 'classroom.school' ],
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

      console.log(error)

      return  { status: 500, data: error }

    }

  }

  private whereSearch(teacher: Teacher, req?: Request):  FindOptionsWhere<ObjectLiteral> | FindOptionsWhere<ObjectLiteral>[] | undefined {

    let search: string = ''

    if(req) {
      for(let value in req.query) {
        if(!!req.query[value]?.length && value === 'search') {
          search = req.query[value] as string
        }
      }
    }

    // todos os alunos possuim classe, é necessário olhar em studentsClassesHistory se está ativo. pois se não estiver
    // significa que o aluno não está mais naquela classe., ele passou de ano por exemplo ou foi transferido.

    let classesIds = teacher.teacherClasses
        .map((teacherClass) => teacherClass.classroom.id)

    let fullSearch: FindOptionsWhere<ObjectLiteral> = {
      classroom: { id: In(classesIds) }
    }

    let whereFilters: FindOptionsWhere<ObjectLiteral> = {
      person: { name: ILike(`%${search}%`) },
      classroom: { id: In(classesIds) }
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
        dv: student.dv,
        state: student.state,
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

  override async saveData(body: DeepPartial<ObjectLiteral>, dateConversion: boolean = false) {

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

      student.person = await PersonClass.newPerson(body, dateConversion);
      student.no = body.order;
      student.ra = body.ra;
      student.dv = body.dv;
      student.state = body.state;
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
      student.dv = body.dv;
      student.state = body.state;
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

    // 1.
    const runTimeClassExecution = ['9C']
    // 2.
    const classroomId = 99
    // 3.
    const runTimeSchool = 'pires'

    for(let classroom of runTimeClassExecution) {

      const localDataToSave = require(`../sheets/${runTimeSchool}/${runTimeSchool}_${classroom}.json`)

      for(let register of localDataToSave) {

        await this.saveData({
          order: register.no,
          name: register.name,
          ra: register.ra,
          dv: register.dv,
          state: register.state,
          birthDate: register.birthDate,
          classroom: { id: classroomId },
        }, true)
      }
    }

    return { status: 200, data: 'ok'}
  }
}

export const studentController = new StudentController();
