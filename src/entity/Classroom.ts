import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm"
import { School } from "./School";
import { Student } from "./Student";
import { Year } from "./Year";

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

  @ManyToOne(type => School, s => s.classrooms, { eager: true})
  school: School

  @ManyToOne(type => Year, y => y.classrooms, { eager: true})
  year: Year
}
