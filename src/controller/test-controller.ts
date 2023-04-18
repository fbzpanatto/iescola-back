import { GenericController } from "./generic-controller";
import { Test } from "../entity/Test";
import { DeepPartial, EntityTarget, ObjectLiteral } from "typeorm";
import { Year } from "../entity/Year";
import { Bimester } from "../entity/Bimester";
import { Teacher } from "../entity/Teacher";
import { Discipline } from "../entity/Discipline";
import {TestCategory} from "../entity/TestCategory";

import { bimesterController } from "./bimester-controller";
import { teacherController } from "./teacher-controller";
import { disciplineController } from "./discipline-controller";
import { yearController } from "./year-controller";
import { testCategoryController } from "./testCategory-controller";

class TestController extends GenericController<EntityTarget<ObjectLiteral>> {
  constructor() {
    super(Test);
  }

  override async saveData(body: DeepPartial<ObjectLiteral>) {

    const year = await this.getYear(body.year.id);
    if (!year) throw new Error('Year not found');

    const bimester = await this.getBimester(body.bimester.id);
    if (!bimester) throw new Error('Bimester not found');

    const teacher = await this.getTeacher(body.teacher.id);
    if (!teacher) throw new Error('Teacher not found');

    const discipline = await this.getDiscipline(body.discipline.id);
    if (!discipline) throw new Error('Discipline not found');

    const testCategory = await this.getTestCategory(body.category.id);
    if (!testCategory) throw new Error('Test Category not found');

    body.name ?? testCategory.name
    body.year = year;
    body.bimester = bimester;
    body.teacher = teacher;
    body.discipline = discipline;
    body.category = testCategory;

    return await this.repository.save(body);
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

  async getTestCategory(testCategoryId: number | string) {
    return await testCategoryController.findOneBy(testCategoryId) as TestCategory;
  }

}

export const testController = new TestController();
