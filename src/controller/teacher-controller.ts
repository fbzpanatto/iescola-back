import { Teacher } from "../entity/Teacher";
import { DeepPartial, EntityTarget, ObjectLiteral } from "typeorm";
import { PersonClass } from "./person-controller";
import { GenericController } from "./generic-controller";
import { Classroom } from "../entity/Classroom";
import { TeacherClasses } from "../entity/TeacherClasses";
import { TeacherDisciplines } from "../entity/TeacherDisciplines";
import { Discipline } from "../entity/Discipline";

import { classroomController } from "./classroom-controller";
import { disciplineController } from "./discipline-controller";
import { teacherClassesController } from "./teacherClasses-controller";
import { teacherDisciplinesController } from "./teacherDisciplines-controller";


class TeacherController extends GenericController<EntityTarget<ObjectLiteral>> {

  constructor() {
    super(Teacher);
  }

  override async saveData(body: DeepPartial<ObjectLiteral>) {


    // TODO: ao invés de fazer isso, tentar apenas com body e substituir os dados como feito em test controller.
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
