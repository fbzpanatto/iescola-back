import { DeepPartial, EntityTarget, ObjectLiteral } from "typeorm";

import { Request } from "express";
import { GenericController } from "./genericController";

import { Student } from "../entity/Student";
import { PersonClass } from "./personController";
import { Classroom } from "../entity/Classroom";
import { StudentTests } from "../entity/StudentTests";
import { Test } from "../entity/Test";
import { StudentClassesHistory } from "../entity/StudentClassesHistory";

import { classroomController} from "./classroomController";
import { studentTestsController} from "./studentTestsController";
import { testController} from "./testController";
import { studentClassesHistoryController} from "./studentClassesHistoryController";

class StudentController extends GenericController<EntityTarget<ObjectLiteral>> {
  constructor() {
    super(Student);
  }

  async getAllStudents(req: Request) {

    const students = await this.repository.find({
      relations: [ 'person', 'classroom.school'],
      where: {}
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
        classroom: student.classroom,
      }

      return { status: 200, data: result }

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

  override async saveData(body: DeepPartial<ObjectLiteral>) {

    const student = new Student();

    body.category = { id: 2 }

    student.person = await PersonClass.newPerson(body);
    student.ra = body.ra;
    student.no = body.no;
    student.classroom = await classroomController.findOneBy(Number(body.classroom.id)) as Classroom

    return await student.save()
  }

}

export const studentController = new StudentController();
