import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm"
import { School } from "./School";
import { Year } from "./Year";
import { TeacherClasses } from "./TeacherClasses";
import { TestClasses } from "./TestClasses";
import { StudentClassesHistory } from "./StudentClassesHistory";
import {ClassCategory} from "./ClassCategory";
import {Student} from "./Student";
import {StudentTests} from "./StudentTests";

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

  @OneToMany(type => Student, s => s.classroom)
  students: Student[]

  @OneToMany( type => StudentTests, sc => sc.registeredInClass)
  registeredInClass: StudentTests[]

  @OneToMany( type => StudentClassesHistory, sc => sc.classroom)
  studentClasses: StudentClassesHistory[]

  @OneToMany( type => TeacherClasses, t => t.classroom)
  teacherClasses: TeacherClasses[]

  @OneToMany( type => TestClasses, t => t.classroom)
  testClasses: TestClasses[]

  @ManyToOne(type => School, s => s.classrooms)
  school: School

  @ManyToOne(type => Year, y => y.classrooms)
  year: Year

  @ManyToOne( type => ClassCategory, c => c.classrooms)
  category: ClassCategory
}
