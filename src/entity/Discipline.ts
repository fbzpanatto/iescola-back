import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from "typeorm"
import {Test} from "./Test";
import {TeacherDisciplines} from "./TeacherDisciplines";

@Entity()
export class Discipline {

  @PrimaryGeneratedColumn()
  id: number

  @Column({
    length: 60,
  })
  name: string

  @Column({select: false})
  active: boolean

  @OneToMany(() => Test, t => t.discipline)
  tests: Test[]

  @OneToMany(() => TeacherDisciplines, t => t.discipline)
  teacherDisciplines: TeacherDisciplines[]
}
