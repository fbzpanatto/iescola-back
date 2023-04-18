import { GenericController } from "./generic-controller";
import { DeepPartial, EntityTarget, ObjectLiteral } from "typeorm";

import { classroomController } from "./classroom-controller";
import { categoryController } from "./category-controller";
import { disciplineController} from "./discipline-controller";

import { Category } from "../entity/Category";
import { Classroom } from "../entity/Classroom";
import { Discipline} from "../entity/Discipline";
import { Person } from "../entity/Person";
import { Student}  from "../entity/Student";
import { Teacher} from "../entity/Teacher";

class PersonController extends GenericController<EntityTarget<ObjectLiteral>> {
  constructor() {
    super(Person);
  }

  override async saveData(body: DeepPartial<ObjectLiteral>) {

    const person = new Person();

    person.name = body.name

    if(body.category){

      const category = await this.getCategory(body);
      if (!category) throw new Error('Category not found');

      person.category = category;
    }

    if(body.ra){

      const student = new Student();
      student.ra = body.ra;

      const classroom = await this.getClassroom(body)
      if (!classroom) throw new Error('Classroom not found');

      student.classroom = classroom;
      person.student = student;

    }

    if (body.disciplines || body.classes) {

      const teacher = new Teacher();

      if(body.disciplines) {

        let disciplines: Discipline[] = [];

        for (const disciplineId of body.disciplines) {
          const discipline = await this.getDiscipline(disciplineId)
          discipline ? disciplines.push(discipline) : null;
        }

        teacher.disciplines = disciplines;

      }

      person.teacher = teacher;
    }

    return await this.repository.save(person);
  }

  async getClassroom(body: DeepPartial<ObjectLiteral>) {
    return await classroomController.findOneBy(Number(body.classroom.id)) as Classroom;
  }

  async getCategory(body: DeepPartial<ObjectLiteral>) {
    return await categoryController.findOneBy(Number(body.category.id)) as Category;
  }

  async getDiscipline(disciplineId: number | string) {
    return await disciplineController.findOneBy(disciplineId) as Discipline;
  }

}

export const personController = new PersonController();
