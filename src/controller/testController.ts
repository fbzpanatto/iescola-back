import { GenericController } from "./genericController";
import { Test } from "../entity/Test";
import { DeepPartial, EntityTarget, ObjectLiteral } from "typeorm";
import { Year } from "../entity/Year";
import { Bimester } from "../entity/Bimester";
import { Teacher } from "../entity/Teacher";
import { Discipline } from "../entity/Discipline";
import { TestCategory } from "../entity/TestCategory";
import { Classroom } from "../entity/Classroom";
import { TestClasses } from "../entity/TestClasses";

import { bimesterController } from "./bimesterController";
import { teacherController } from "./teacherController";
import { disciplineController } from "./disciplineController";
import { yearController } from "./yearController";
import { testCategoryController } from "./testCategoryController";
import { testClassesController } from "./testClassesController";
import { classroomController } from "./classroomController";

interface TestClass {name: string, school: string, classroomId: number, classroom: string, year: number, bimester: string, category: string, teacher: string, discipline: string}

class TestController extends GenericController<EntityTarget<ObjectLiteral>> {
  constructor() {
    super(Test);
  }

  async many(body: DeepPartial<ObjectLiteral>) {

    const classes = await classroomController.getAll({ where: { category: { id: body.classCategory.id } } }) as Classroom[]

    const test = new Test()

    test.name = body.name;
    test.questions = body.questions;
    test.active = body.active;

    await this.repository.save(test)

    const year = await this.getYear(body.year.id);
    const bimester = await this.getBimester(body.bimester.id);
    const teacher = await this.getTeacher(body.teacher.id);
    const discipline = await this.getDiscipline(body.discipline.id);
    const testCategory = await this.getTestCategory(body.category.id);

    for(let classroom of classes) {

      const testClasses = new TestClasses()

      testClasses.classroom = classroom
      testClasses.test = test

      await testClassesController.saveData(testClasses)
    }

    test.year = year;
    test.bimester = bimester;
    test.teacher = teacher;
    test.discipline = discipline;
    test.category = testCategory;

    return await this.repository.save(test);
  }

  override async getAll() {

    let response: { testId: number, classes: TestClass[] }[] = []

    const tests = await this.repository.find({ relations: ['year', 'bimester', 'teacher', 'discipline', 'category', 'testClasses'] })

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

  async getOne(id: number | string) {
    const test = await this.repository.findOneBy({ id: Number(id) }) as Test;

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
      year: test.year,
      bimester: test.bimester,
      category: test.category,
      active: test.active,
    }
  }


  override async saveData(body: DeepPartial<ObjectLiteral>) {

    const test = new Test()

    test.name = body.name;
    test.questions = body.questions;
    test.active = body.active;

    await this.repository.save(test)

    const year = await this.getYear(body.year.id);
    const bimester = await this.getBimester(body.bimester.id);
    const teacher = await this.getTeacher(body.teacher.id);
    const discipline = await this.getDiscipline(body.discipline.id);
    const testCategory = await this.getTestCategory(body.category.id);

    if(body.testClasses) {

      for (let classId of body.testClasses) {
        const classroom = await this.getClassroom(classId)
        const testClasses = new TestClasses()

        testClasses.classroom = classroom
        testClasses.test = test

        await testClassesController.saveData(testClasses)
      }
    }

    test.year = year;
    test.bimester = bimester;
    test.teacher = teacher;
    test.discipline = discipline;
    test.category = testCategory;

    return await this.repository.save(test);
  }

  async getYear(yearId: number | string) {
    return await yearController.findOneBy(yearId) as Year;
  }

  async getBimester(bimesterId: number | string) {
    return await bimesterController.findOneBy(bimesterId) as Bimester;
  }

  async getTeacher(teacherId: number | string) {
    return await teacherController.findOneBy(teacherId) as Teacher;
  }

  async getDiscipline(disciplineId: number | string) {
    return await disciplineController.findOneBy(disciplineId) as Discipline;
  }

  async getClassroom(classroomId: number | string) {
    return await classroomController.findOneBy(classroomId) as Classroom;
  }

  async getTestCategory(testCategoryId: number | string) {
    return await testCategoryController.findOneBy(testCategoryId) as TestCategory;
  }

}

export const testController = new TestController();
