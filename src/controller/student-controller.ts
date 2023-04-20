import { GenericController } from "./generic-controller";
import { Student } from "../entity/Student";
import { DeepPartial, EntityTarget, ObjectLiteral } from "typeorm";
import { classroomController } from "./classroom-controller";
import { PersonClass } from "./person-controller";
import { Classroom } from "../entity/Classroom";
import { Request } from "express";
import { StudentTests } from "../entity/StudentTests";
import { studentGradeTestController } from "./studentGradeTest-controller";
import { testController } from "./test-controller";
import { Test } from "../entity/Test";

class StudentController extends GenericController<EntityTarget<ObjectLiteral>> {
  constructor() {
    super(Student);
  }

  async linkStudentsWithTests(req: Request) {

    const students = await this.repository.find({ where: { classroom: { id: req.query.classroom } }}) as Student[];
    const test = await testController.findOneBy(req.query.test as string) as Test;

    for(let student of students) {

      const studentTest = await studentGradeTestController.findOne({ where: { student: { id: student.id }, test: { id: test.id } } })

      if (!studentTest) {

        const studentTests = new StudentTests()

        studentTests.student = student
        studentTests.test = test

        await studentGradeTestController.saveData(studentTests)

      }
    }
    return await this.repository.find({ where: { classroom: { id: req.query.classroom }, studentTests: { test: { id: req.query.test } } }})
  }

  override async saveData(body: DeepPartial<ObjectLiteral>) {

    const student = new Student();
    student.person = await PersonClass.newPerson(body);
    student.ra = body.ra;

    if (body.classroom) {
      student.classroom = await classroomController.findOneBy(body.classroom.id) as Classroom;
    }

    return await student.save()
  }

}

export const studentController = new StudentController();
