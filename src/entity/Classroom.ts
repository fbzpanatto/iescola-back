import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm"
import { School } from "./School";
import { Year } from "./Year";
import { TeacherClasses } from "./TeacherClasses";
import { TestClasses } from "./TestClasses";
import { StudentClassesHistory } from "./StudentClassesHistory";
import {ClassCategory} from "./ClassCategory";
import {Student} from "./Student";

@Entity()
export class Classroom {

  @PrimaryGeneratedColumn()
  id: number

  @Column({
    length: 2
  })
  name: string

  @Column({ default: true, select: false })
  active: boolean

  @OneToMany(type => Student, s => s.classroom, {eager: true})
  students: Student[]

  @OneToMany( type => StudentClassesHistory, sc => sc.classroom)
  studentClasses: StudentClassesHistory[]

  @OneToMany( type => TeacherClasses, t => t.classroom)
  teacherClasses: TeacherClasses[]

  @OneToMany( type => TestClasses, t => t.classroom)
  testClasses: TestClasses[]

  @ManyToOne(type => School, s => s.classrooms, { eager: true})
  school: School

  @ManyToOne(type => Year, y => y.classrooms, { eager: true})
  year: Year

  @ManyToOne( type => ClassCategory, c => c.classrooms)
  category: ClassCategory
}
