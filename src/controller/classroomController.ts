import { GenericController } from "./genericController";
import { Classroom } from "../entity/Classroom";
import { Request } from "express";
import { DeepPartial, EntityTarget, ObjectLiteral } from "typeorm";
import { schoolController } from "./schoolController";
import { yearController } from "./yearController";
import { classCategoryController } from "./classCategoryController";

class ClassroomController extends GenericController<EntityTarget<ObjectLiteral>> {
  constructor() {
    super(Classroom);
  }

  async getAllClasses(req: Request) {

    try {

      const classes = await this.repository.find({
        relations: [ 'school', 'category'],
        where: {}
      }) as Classroom[]

      let result = classes.map(classroom => {
        return {
          id: classroom.id,
          name: classroom.name,
          school: classroom.school.name,
          category: classroom.category.name
        }
      })

      return { status: 200, data: result }

    } catch (error) {
      return { status: 500, data: error }
    }
  }

  async many(body: DeepPartial<ObjectLiteral>) {

    for(let element of body['register']) {

      const school = await schoolController.findOneBy(element.school.id);
      const year = await yearController.findOneBy(element.year.id);

      for(let classroom of element['classes']) {

        const category = await classCategoryController.findOneBy(classroom.category);

        let object = {
          name: classroom.name,
          school: school,
          year: year,
          category: category
        }

        await this.repository.save(object);
      }
    }

    return 'teste'
  }

  override async saveData(body: DeepPartial<ObjectLiteral>) {

    const school = await schoolController.findOneBy(body.school.id);

    if (!school) throw new Error('School not found');

    body.school = school;

    return await this.repository.save(body);
  }

  async updateCategoryId(id: string, body: DeepPartial<ObjectLiteral>) {

    const classrooms = await this.repository.find();


    return 'updateCategoryId'
  }

}

export const classroomController = new ClassroomController();
