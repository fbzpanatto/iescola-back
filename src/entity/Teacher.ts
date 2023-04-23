import {
  Entity,
  OneToOne,
  JoinColumn,
  BaseEntity,
  PrimaryGeneratedColumn,
  OneToMany
} from "typeorm"
import { Person } from "./Person";
import { Test } from "./Test";
import { TeacherClasses } from "./TeacherClasses";
import { TeacherDisciplines } from "./TeacherDisciplines";

@Entity()
export class Teacher extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Person, p => p.teacher, {eager: true})
  @JoinColumn()
  person: Person;

  @OneToMany(() => Test, t => t.teacher)
  tests: Test[]

  @OneToMany(() => TeacherClasses, t => t.teacher)
  teacherClasses: TeacherClasses[]

  @OneToMany(()=> TeacherDisciplines, t => t.teacher)
  teacherDisciplines: TeacherDisciplines[]
}
