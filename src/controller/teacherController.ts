import { Request } from "express";
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
import {enumOfTeacherCategories} from "../middleware/isTeacher";


class TeacherController extends GenericController<EntityTarget<ObjectLiteral>> {

  constructor() {
    super(Teacher);
  }

  async getAllTeachers(req: Request) {

    const { user: userId, category } = req.body.user;

    let where = {};

    if(enumOfTeacherCategories.superTeacher != category as number) {

      where = { person: { user: { id: userId } } }
    }

    const teachers = await this.repository.find({
      relations: ['person.user', 'teacherDisciplines', 'teacherClasses.classroom.school'],
      where: where
    })

    return teachers.map(teacher => {
      return {
        id: teacher.id,
        name: teacher.person.name,
        teacherClasses: teacher.teacherClasses
          .map((teacherClass: any) => { return { id: teacherClass.classroom.id, name: teacherClass.classroom.name, school: teacherClass.classroom.school.name }})
          .sort((a: { id: number, name: string }, b: { id: number, name: string }) => a.id - b.id),
        teacherDisciplines: teacher.teacherDisciplines
          .map((teacherDiscipline: any) => { return { id: teacherDiscipline.discipline.id, name: teacherDiscipline.discipline.name }})
          .sort((a: { id: number, name: string }, b: { id: number, name: string }) => a.id - b.id)
      }
    })
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

    console.log(body)

    const teacher = new Teacher();
    teacher.person = await PersonClass.newPerson(body);
    await teacher.save();

    if(body.teacherClasses) {

      for(let element of body.teacherClasses) {

        const classroom = await classroomController.findOneBy(element) as Classroom;
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

        const discipline = await disciplineController.findOneBy(element) as Discipline;
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
