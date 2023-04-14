import { GenericController } from "./generic-controller";
import { Person } from "../entity/Person";
import { DeepPartial, EntityTarget, ObjectLiteral } from "typeorm";
import { Student}  from "../entity/Student";
import { classroomController } from "./classroom-controller";
import { categoryController } from "./category-controller";
import { Classroom } from "../entity/Classroom";
import { Category } from "../entity/Category";

class PersonController extends GenericController<EntityTarget<ObjectLiteral>> {
  constructor() {
    super(Person);
  }

  override async saveData(body: DeepPartial<ObjectLiteral>) {

    const person = new Person();
    const student = new Student();

    person.name = body.name

    if(body.category){

      const category = await this.getCategory(body) as Category ;
      if (!category) throw new Error('Category not found');

      person.category = category;
    }

    if(body.ra){

      student.ra = body.ra;

      const classroom = await this.getClassroom(body) as Classroom
      if (!classroom) throw new Error('Classroom not found');

      student.classroom = classroom;
    }

    person.student = student;

    return await this.repository.save(person);
  }

  async getClassroom(body: DeepPartial<ObjectLiteral>) {
    return await classroomController.findOneBy(body.classroom.id);
  }

  async getCategory(body: DeepPartial<ObjectLiteral>) {
    return await categoryController.findOneBy(body.category.id);
  }

}

export const personController = new PersonController();
