import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm"
import { Max } from "class-validator";
import { Teacher } from "./Teacher";
import { Student } from "./Student";

@Entity()
export class Category {

  @PrimaryGeneratedColumn()
  id: number

  @Max(60)
  @Column({unique: true})
  name: string

  @Column()
  active: boolean

  @OneToMany(type => Teacher, teacher  => teacher.category)
  teachers: Teacher[]

  @OneToMany(type => Student, student  => student.category)
  students: Student[]
}
