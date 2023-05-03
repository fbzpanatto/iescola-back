import { Teacher } from "../entity/Teacher";
import { DeepPartial, EntityTarget, ObjectLiteral } from "typeorm";
import { PersonClass } from "./personController";
import { GenericController } from "./genericController";
import { Classroom } from "../entity/Classroom";
import { TeacherClasses } from "../entity/TeacherClasses";
import { TeacherDisciplines } from "../entity/TeacherDisciplines";
import { Discipline } from "../entity/Discipline";

import { classroomController } from "./classroomController";
import { disciplineController } from "./disciplineController";
import { teacherClassesController } from "./teacherClassesController";
import { teacherDisciplinesController } from "./teacherDisciplinesController";


class TeacherController extends GenericController<EntityTarget<ObjectLiteral>> {

  constructor() {
    super(Teacher);
  }

  async createForAll(body: DeepPartial<ObjectLiteral>) {

    const teacher = new Teacher();
    teacher.person = await PersonClass.newPerson(body);
    await teacher.save();

    const classrooms = await classroomController.getAll() as Classroom[];
    const disciplines = await disciplineController.getAll() as Discipline[];

    for(let classroom of classrooms) {
      const teacherClass = new TeacherClasses() ;
      teacherClass.classroom = classroom;
      teacherClass.teacher = teacher;

      await teacherClassesController.saveData(teacherClass);
    }

    for (let discipline of disciplines) {
      const teacherDiscipline = new TeacherDisciplines();
      teacherDiscipline.discipline = discipline;
      teacherDiscipline.teacher = teacher;

      await teacherDisciplinesController.saveData(teacherDiscipline);
    }

    return 'teste'
  }

  override async saveData(body: DeepPartial<ObjectLiteral>) {

    const teacher = new Teacher();
    teacher.person = await PersonClass.newPerson(body);
    await teacher.save();

    if(body.teacherClasses) {

      for(let element of body.teacherClasses) {

        const classroom = await classroomController.findOneBy(element.classId) as Classroom;
        const teacherClass = new TeacherClasses();

        teacherClass.classroom = classroom;
        teacherClass.teacher = teacher;
        teacherClass.statedAt = element.statedAt;
        teacherClass.endedAt = element.endedAt;

        await teacherClassesController.saveData(teacherClass);
      }

    }

    if(body.teacherDisciplines) {

      for(let element of body.teacherDisciplines) {

        const discipline = await disciplineController.findOneBy(element.disciplineId) as Discipline;
        const teacherDiscipline = new TeacherDisciplines();

        teacherDiscipline.discipline = discipline;
        teacherDiscipline.teacher = teacher;
        teacherDiscipline.statedAt = element.statedAt;
        teacherDiscipline.endedAt = element.endedAt;

        await teacherDisciplinesController.saveData(teacherDiscipline);
      }
    }

    return await teacher.save()
  }
}

export const teacherController = new TeacherController();
