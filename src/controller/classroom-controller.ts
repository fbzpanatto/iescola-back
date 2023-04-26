import { GenericController } from "./generic-controller";
import { Classroom } from "../entity/Classroom";
import { DeepPartial, EntityTarget, ObjectLiteral } from "typeorm";
import { schoolController } from "./school-controller";
import { yearController } from "./year-controller";

class ClassroomController extends GenericController<EntityTarget<ObjectLiteral>> {
  constructor() {
    super(Classroom);
  }

  async many(body: DeepPartial<ObjectLiteral>) {

    for(let element of body['register']) {

      const school = await schoolController.findOneBy(element.school.id);
      const year = await yearController.findOneBy(element.year.id);

      for(let classroom of element['classes']) {

        let object = {
          name: classroom.name,
          school: school,
          year: year
        }

        await this.repository.save(object);
      }
    }

    return 'teste'
  }

  override async saveData(body: DeepPartial<ObjectLiteral>) {

    const school = await schoolController.findOneBy(body.school.id);
    const year = await yearController.findOneBy(body.year.id);

    if (!school) throw new Error('School not found');
    if (!year) throw new Error('Year not found');

    body.school = school;
    body.year = year;

    return await this.repository.save(body);
  }

  async updateCategoryId(id: string, body: DeepPartial<ObjectLiteral>) {

    console.log(body)

    const classrooms = await this.repository.find();


    return 'updateCategoryId'
  }

}

export const classroomController = new ClassroomController();
