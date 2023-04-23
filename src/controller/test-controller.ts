import { GenericController } from "./generic-controller";
import { Test } from "../entity/Test";
import { DeepPartial, EntityTarget, ObjectLiteral } from "typeorm";
import { Year } from "../entity/Year";
import { Bimester } from "../entity/Bimester";
import { Teacher } from "../entity/Teacher";
import { Discipline } from "../entity/Discipline";
import { TestCategory } from "../entity/TestCategory";
import { Classroom } from "../entity/Classroom";
import { TestClasses } from "../entity/TestClasses";

import { bimesterController } from "./bimester-controller";
import { teacherController } from "./teacher-controller";
import { disciplineController } from "./discipline-controller";
import { yearController } from "./year-controller";
import { testCategoryController } from "./testCategory-controller";
import { testClassesController } from "./testClasses-controller";
import { classroomController } from "./classroom-controller";

class TestController extends GenericController<EntityTarget<ObjectLiteral>> {
  constructor() {
    super(Test);
  }

  // TODO: Refactor this method
  /* override async getAll() {
    return await this.repository.find({ relations: ['year', 'bimester', 'teacher', 'discipline', 'category', 'testClasses'] })
  } */

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
