import {GenericController} from "./generic-controller";
import {DeepPartial, EntityTarget, ObjectLiteral} from "typeorm";

import {classroomController} from "./classroom-controller";
import {categoryController} from "./category-controller";
import {disciplineController} from "./discipline-controller";

import {Category} from "../entity/Category";
import {Classroom} from "../entity/Classroom";
import {Discipline} from "../entity/Discipline";
import {Person} from "../entity/Person";
import {Student} from "../entity/Student";
import {Teacher} from "../entity/Teacher";
import {TeacherClasses} from "../entity/TeacherClasses";
import {teacherClassesController} from "./teacherClasses-controller";
import {teacherController} from "./teacher-controller";

class PersonController extends GenericController<EntityTarget<ObjectLiteral>> {
  constructor() {
    super(Person);
  }

  override async saveData(body: DeepPartial<ObjectLiteral>) {

    const person = new Person();

    person.name = body.name

    if(body.category) { person.category = await this.getCategory(body) }

    if(body.ra){

      const student = new Student();
      student.ra = body.ra;

      const classroom = await this.getClassroom(body.classroom.id)
      if (!classroom) throw new Error('Classroom not found');

      student.classroom = classroom;
      person.student = student;
    }

    if(body.disciplines || body.classes) {

      const teacher = new Teacher()
      await teacherController.saveData(teacher)
      person.teacher = teacher;

      if(body.disciplines) {
        // TODO: implementar disciplinas
      }

      if(body.classes){

        for (const classId of body.classes) {

          let teacherClass = new TeacherClasses();

          const classroom = await this.getClassroom(classId)
          if (!classroom) throw new Error('Classroom not found');

          teacherClass.classroom = classroom;
          teacherClass.teacher = teacher;

          await teacherClassesController.saveData(teacherClass);
        }
      }
    }

    return await this.repository.save(person);
  }

  async getClassroom(classId: number | string) {
    return await classroomController.findOneBy(classId) as Classroom;
  }

  async getCategory(body: DeepPartial<ObjectLiteral>) {
    return await categoryController.findOneBy(Number(body.category.id)) as Category;
  }

  async getDiscipline(disciplineId: number | string) {
    return await disciplineController.findOneBy(disciplineId) as Discipline;
  }

}

export const personController = new PersonController();
