import { DeepPartial, EntityTarget, ILike, In, ObjectLiteral } from "typeorm";

import { Request } from "express";
import { GenericController } from "./genericController";

import { Student } from "../entity/Student";
import { PersonClass } from "./personController";
import { Classroom } from "../entity/Classroom";
import { StudentClassesHistory } from "../entity/StudentClassesHistory";
import { Teacher } from "../entity/Teacher";
import { Year } from "../entity/Year";
import { TeacherClasses } from "../entity/TeacherClasses";

import { yearController } from "./yearController";
import { classroomController } from "./classroomController";
import { studentClassesHistoryController } from "./studentClassesHistoryController";
import { teacherController } from "./teacherController";

class StudentController extends GenericController<EntityTarget<ObjectLiteral>> {
  constructor() {
    super(Student);
  }

  formatDateToBrazil(data: Date) {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();

    return dia + '/' + mes + '/' + ano;
  }

  async getAllStudents(req: Request) {

    try {

      const { user: UserId } = req?.body.user
      const { year: queryYear, search } = req.query

      const teacher = await teacherController.findOne({
        relations: ['person.user', 'teacherClasses.classroom'],
        where: {
          person: { user: { id: UserId } },
          teacherClasses: { active: true }
        }
      }) as Teacher

      const studentClassesHistory = await studentClassesHistoryController.getAll({
        relations: [ 'student.person', 'classroom.school' ],
        where: {
          year: { id: Number(queryYear) },
          student: {
            person: { name: ILike(`%${search}%`) }
          },
          classroom: {
            id: In(teacher.teacherClasses.map((register: TeacherClasses) => register.classroom.id))
          }
        }
      }) as StudentClassesHistory[]

      let result = studentClassesHistory.map((studentClassHistory: StudentClassesHistory) => {
        return {
          id: studentClassHistory.student.id,
          order: studentClassHistory.student.no,
          name: studentClassHistory.student.person.name,
          classroom: studentClassHistory.classroom.name,
          school: studentClassHistory.classroom.school.name,
          startedAt: this.formatDateToBrazil(studentClassHistory.startedAt),
          endedAt: studentClassHistory.endedAt !== null ? 'Encerrado: ' + this.formatDateToBrazil(studentClassHistory.endedAt) : 'Matriculado',
        }
      })

      return { status: 200, data: result }

    } catch (error: any) {

      return  { status: 500, data: error }

    }
  }

  async getOneStudent(req: Request) {

    try {

      const student = await this.repository.findOne({
        relations: [ 'person', 'classroom.school'],
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
          school: student.classroom.school.name
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
      const currentYear = await yearController.findOne({ where: { active: true } }) as Year

      // TODO: Remover essa gambiarra
      body.category = { id: 2 }

      const studentInDB = await this.repository.findOne({ where: { ra: body.ra, dv: body.dv } }) as Student
      if( studentInDB ) { return { status: 409, data: 'O RA informado já está em uso.' } }

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
      studentClassroom.year = currentYear
      await studentClassesHistoryController.saveData(studentClassroom)

      return { status: 200, data: student }

    } catch (error: any) {

      console.log('studentController: ', error)

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
        studentClassroom.year = await yearController.findOne({ where: { active: true } }) as Year
        await studentClassesHistoryController.saveData(studentClassroom)
      }

      return { status: 200, data: student }

    } catch (error) {

      return { status: 500, data: error }

    }
  }

  async testCreation(){

    console.log('Iniciando a criação dos alunos...')

    try {

      // 1.
      const runTimeClassExecution = ['9A']
      // 2.
      const classroomId = 25
      // 3.
      const runTimeSchool = 'benno'

      console.log('Iniciando a criação dos alunos...')

      for(let classroom of runTimeClassExecution) {

        const localDataToSave = require(`../sheets/${runTimeSchool}/${runTimeSchool}_${classroom}.json`)

        console.log(localDataToSave)

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

    } catch (error: any) {

      console.log(error)

      return { status: 500, data: error}
    }

  }
}

export const studentController = new StudentController();
