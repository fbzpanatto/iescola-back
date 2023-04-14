import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, Unique} from "typeorm"
import { Classroom } from "./Classroom";
import { StudentGradeTest } from "./StudentGradeTest";

@Entity()
export class Student {

  @PrimaryGeneratedColumn()
  id: number

  @Column({
    length: 100
  })
  name: string

  @Column({
    length: 20,
    unique: true
  })
  ra: string

  @Column()
  active: boolean

  @ManyToOne(type => Classroom, c => c.students)
  classroom: Classroom

  @OneToMany(type => StudentGradeTest, st => st.student)
  studentGradeTests: StudentGradeTest[];
}
