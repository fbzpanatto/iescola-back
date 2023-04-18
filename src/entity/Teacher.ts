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
import {StudentGradeTest} from "./StudentGradeTest";
import {TeacherClasses} from "./TeacherClasses";

@Entity()
export class Teacher extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Discipline)
  @JoinTable()
  disciplines: Discipline[]

  @OneToOne(() => Person, p => p.teacher, {eager: true})
  @JoinColumn()
  person: Person;

  @OneToMany(() => Test, t => t.teacher)
  tests: Test[]

  // TODO: uma tabela para guardar a relação entre professor e salas

  @OneToMany(type => TeacherClasses, tc => tc.teacher)
  teacherClasses: TeacherClasses[];
}
