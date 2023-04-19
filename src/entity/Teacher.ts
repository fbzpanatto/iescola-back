import {
  Entity,
  ManyToMany,
  JoinTable,
  OneToOne,
  JoinColumn,
  BaseEntity,
  PrimaryGeneratedColumn,
  OneToMany
} from "typeorm"
import { Discipline } from "./Discipline";
import { Person} from "./Person";
import {Test} from "./Test";
import {Classroom} from "./Classroom";
import {TeacherClasses} from "./TeacherClasses";

@Entity()
export class Teacher extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Discipline)
  @JoinTable()
  disciplines: Discipline[]

  /* @ManyToMany(() => Classroom)
  @JoinTable()
  classes: Classroom[] */

  @OneToOne(() => Person, p => p.teacher, {eager: true})
  @JoinColumn()
  person: Person;

  @OneToMany(() => Test, t => t.teacher)
  tests: Test[]

  @OneToMany(() => TeacherClasses, t => t.teacher, {cascade: true})
  teacherClasses: TeacherClasses[]
}
