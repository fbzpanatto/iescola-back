import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm"
import { School } from "./School";
import { Student } from "./Student";
import { Year } from "./Year";
import { TeacherClasses } from "./TeacherClasses";
import { TestClasses } from "./TestClasses";

@Entity()
export class Classroom {

  @PrimaryGeneratedColumn()
  id: number

  @Column({
    length: 2
  })
  name: string

  @Column()
  active: boolean

  @OneToMany(type => Student, s => s.classroom)
  students: Student[]

  @OneToMany( type => TeacherClasses, t => t.classroom)
  teacherClasses: TeacherClasses[]

  @OneToMany( type => TestClasses, t => t.classroom)
  testClasses: TestClasses[]

  @ManyToOne(type => School, s => s.classrooms, { eager: true})
  school: School

  @ManyToOne(type => Year, y => y.classrooms, { eager: true})
  year: Year
}
