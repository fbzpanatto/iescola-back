import { GenericController } from "./generic-controller";
import { Teacher } from "../entity/Teacher";
import { DeepPartial, EntityTarget, ObjectLiteral } from "typeorm";
import { disciplineController } from "./discipline-controller";

class TeacherController extends GenericController<EntityTarget<ObjectLiteral>> {
  constructor() {
    super(Teacher);
  }

  /* override async saveData(body: DeepPartial<ObjectLiteral>) {

    const disciplines: ObjectLiteral[] = [];

    for (const disciplineId of body.disciplines) {
      const discipline = await disciplineController.findOneBy(Number(disciplineId));
      if (discipline) {
        disciplines.push(discipline);
      }
    }

    body.disciplines = disciplines;

    return await this.repository.save(body);
  } */

}

export const teacherController = new TeacherController();
