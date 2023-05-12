import { GenericController } from "./genericController";
import { Test } from "../entity/Test";
import { DeepPartial, EntityTarget, ObjectLiteral } from "typeorm";
import { Classroom } from "../entity/Classroom";
import { TestClasses } from "../entity/TestClasses";

import { testClassesController } from "./testClassesController";
import { classroomController } from "./classroomController";

interface TestClass {name: string, school: string, classroomId: number, classroom: string, year: number, bimester: string, category: string, teacher: string, discipline: string}

class TestController extends GenericController<EntityTarget<ObjectLiteral>> {

  constructor() {
    super(Test);
  }

  async getOne(id: number | string) {
    const test = await this.repository.findOneBy({ id: Number(id) }) as Test;

    let testClasses = test.testClasses
      .map((testClass) => { return { id: testClass.classroom.id, name: testClass.classroom.name }})
      .sort((a, b) => a.id - b.id)

    let teacherClasses = test.teacher
      .teacherClasses
      .map((teacherClass) => { return { id: teacherClass.classroom.id, name: teacherClass.classroom.name }})
      .sort((a, b) => a.id - b.id)

    let teacherDisciplines = test.teacher
      .teacherDisciplines
      .map((discipline) => { return { id: discipline.discipline.id,  name: discipline.discipline.name }})
      .sort((a, b) => a.id - b.id)

    return {
      id: test.id,
      name: test.name,
      questions: test.questions,
      discipline: test.discipline,
      teacherPerson: test.teacher,
      teacherDisciplines: teacherDisciplines,
      teacherClasses: teacherClasses,
      testClasses: testClasses,
      year: test.year,
      bimester: test.bimester,
      category: test.category,
      active: test.active,
    }
  }

  override async getAll() {

    let response: { testId: number, classes: TestClass[] }[] = []

    const tests = await this.repository.find()

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
}

export const testController = new TestController();
