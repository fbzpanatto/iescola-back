import { Request } from "express";
import { Teacher } from "../entity/Teacher";
import {DeepPartial, EntityTarget, FindOptionsWhere, ILike, ObjectLiteral} from "typeorm";
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
import { enumOfTeacherCategories } from "../middleware/isTeacher";

const RELATIONS = ['person.user', 'teacherDisciplines', 'teacherClasses.classroom.school']


class TeacherController extends GenericController<EntityTarget<ObjectLiteral>> {

  constructor() {
    super(Teacher);
  }

  async getOneTeacher(req: Request) {

    try {

      const { id } = req.params;
      const { user: userId, category } = req.body.user;

      if(enumOfTeacherCategories.teacher === category as number) {

          const teacher = await this.repository.findOne({
            relations: ['person.user'],
            where: { person: { user: { id: userId } } }
          }) as Teacher

          if(teacher.id != Number(id)) {
            return { status: 403, data: 'Forbidden!' }
          }
      }

      const teacher = await this.repository.findOne({
        relations: ['person.user', 'teacherDisciplines', 'teacherClasses.classroom.school'],
        where: { id: id, teacherDisciplines: { active: true }, teacherClasses: { active: true } }
      }) as Teacher

      let response = this.formatedTeacher(teacher)

      return { status: 200, data: response }

    } catch (error: any) {

      return { status: 500, data: error.message }

    }

  }

  async getAllTeachers(req: Request) {

    try {

      const { user: userId, category } = req.body.user;

      const teachers = await this.repository.find({
        relations: RELATIONS,
        where: this.whereSearch(req)
      }) as Teacher[]

      let result = teachers.map(teacher => this.formatedTeacher(teacher as Teacher))

      return { status: 200, data: result }

    } catch (error: any) {

      return { status: 500, data: error.message }

    }

  }

  whereSearch(req: Request) {

    const { user: userId, category } = req.body.user;

    let search: string = '';

    if(req) {
      for(let value in req.query) {
        if(!!req.query[value]?.length && value === 'search') {
          search = req.query[value] as string
        }
      }
    }

    let fullSearch: FindOptionsWhere<ObjectLiteral> = {}
    let whereFilters: FindOptionsWhere<ObjectLiteral> = {
      person: { name: ILike(`%${search}%`) },
    }

    if(enumOfTeacherCategories.superTeacher != Number(category)) {
      fullSearch = { person: { user: { id: userId } } }
      whereFilters = { person: { user: { id: userId }, name: ILike(`%${search}%`) } }
    }

    return search.length > 0 ? whereFilters : fullSearch
  }

  override async saveData(body: DeepPartial<ObjectLiteral>) {

    try {

      body.category = { id: enumOfTeacherCategories.teacher }

      const teacher = new Teacher();
      teacher.person = await PersonClass.newPerson(body);
      await teacher.save();

      if(body.teacherClasses) {

        for(let classId of body.teacherClasses) {

          const classroom = await classroomController.findOneBy(classId) as Classroom;
          const teacherClass = new TeacherClasses();

          teacherClass.classroom = classroom;
          teacherClass.teacher = teacher;
          teacherClass.statedAt = new Date();

          await teacherClassesController.temporarySave(teacherClass)
        }

      }

      if(body.teacherDisciplines) {

        for(let element of body.teacherDisciplines) {

          const discipline = await disciplineController.findOneBy(element) as Discipline;
          const teacherDiscipline = new TeacherDisciplines();

          teacherDiscipline.discipline = discipline;
          teacherDiscipline.teacher = teacher;
          teacherDiscipline.statedAt = new Date();

          await teacherDisciplinesController.saveData(teacherDiscipline);
        }
      }

      let result = await teacher.save()

      return { status: 200, data: result }

    } catch (error: any) {

      return { status: 500, data: error.message }

    }
  }

  async updateOneData(req: Request) {

    const { body, params } = req;

    try {

      const teacher = await this.repository.findOne({
        relations: ['person'],
        where: { id: Number(params.id) }
      }) as Teacher

      if(body.teacherClasses) {

        //create a new relation
        for(let classID of body.teacherClasses as number[]) {

          const classroom = await classroomController.findOneBy(classID) as Classroom;

          const relation = await teacherClassesController.findOne({
            relations: ['classroom', 'teacher'],
            where: { teacher: teacher, classroom: classroom, active: true }
          }) as TeacherClasses;

          if(!relation) {
            const teacherClass = new TeacherClasses();

            teacherClass.classroom = classroom;
            teacherClass.teacher = teacher;
            teacherClass.statedAt = new Date();

            await teacherClassesController.temporarySave(teacherClass)
          }
        }

        // update the relation
        const teacherClasses = await teacherClassesController.getAll({
          relations: ['classroom', 'teacher'],
          where: { teacher: teacher, active: true }
        }) as TeacherClasses[];

        for(let relation of teacherClasses) {

          if(!body.teacherClasses?.includes(relation.classroom.id)) {
            await teacherClassesController.updateOneBy(relation.id, {
              active: false,
              endedAt: new Date()
            })
          }
        }
      }

      if(body.teacherDisciplines) {

        //create a new relation
        for(let disciplineID of body.teacherDisciplines as number[]) {

        const discipline = await disciplineController.findOneBy(disciplineID) as Discipline;

        const relation = await teacherDisciplinesController.findOne({
            relations: ['discipline', 'teacher'],
            where: { teacher: teacher, discipline: discipline, active: true }
        }) as TeacherDisciplines;

          if(!relation) {
              const teacherDiscipline = new TeacherDisciplines();

              teacherDiscipline.discipline = discipline;
              teacherDiscipline.teacher = teacher;
              teacherDiscipline.statedAt = new Date();

              await teacherDisciplinesController.saveData(teacherDiscipline);
          }
        }

        // update the relation
        const teacherDisciplines = await teacherDisciplinesController.getAll({
        relations: ['discipline', 'teacher'],
        where: { teacher: teacher, active: true }
        }) as TeacherDisciplines[];

        for(let relation of teacherDisciplines) {

          if(!body.teacherDisciplines?.includes(relation.discipline.id)) {
              await teacherDisciplinesController.updateOneBy(relation.id, {
              active: false,
              endedAt: new Date()
              })
          }
        }
      }

      teacher.person.name = body.name;
      teacher.person.birthDate = body.birthDate;

      await teacher.person.save();

      return { status: 200, data: teacher }

    } catch (error: any) {

      return { status: 500, data: error.message}

    }

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
      teacherClass.statedAt = new Date();

      await teacherClassesController.temporarySave(teacherClass)
    }

    for (let discipline of disciplines) {
      const teacherDiscipline = new TeacherDisciplines();
      teacherDiscipline.discipline = discipline;
      teacherDiscipline.teacher = teacher;
      teacherDiscipline.statedAt = new Date();

      await teacherDisciplinesController.saveData(teacherDiscipline);
    }

    return 'teste'
  }

  formatedTeacher(teacher: Teacher) {

    return {
      id: teacher.id,
      name: teacher.person.name,
      birthDate: teacher.person.birthDate,
      teacherClasses: teacher.teacherClasses
        .map((teacherClass: any) => { return { id: teacherClass.classroom.id, name: teacherClass.classroom.name, school: teacherClass.classroom.school.name }})
        .sort((a: { id: number, name: string }, b: { id: number, name: string }) => a.id - b.id),
      teacherDisciplines: teacher.teacherDisciplines
        .map((teacherDiscipline: any) => { return { id: teacherDiscipline.discipline.id, name: teacherDiscipline.discipline.name }})
        .sort((a: { id: number, name: string }, b: { id: number, name: string }) => a.id - b.id)
    }
  }
}

export const teacherController = new TeacherController();
