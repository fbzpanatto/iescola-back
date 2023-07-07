import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm"
import { IsInt, Length } from "class-validator";
import { Classroom } from "./Classroom";
import { Test } from "./Test";
import {StudentClassesHistory} from "./StudentClassesHistory";

@Entity()
export class Year {

  @PrimaryGeneratedColumn()
  id: number

  @Length(4, 4)
  @IsInt()
  @Column({ unique: true})
  name: number

  @Column({ default: true })
  active: boolean

  @OneToMany(type => StudentClassesHistory, s => s.year)
  studentClasses: StudentClassesHistory[]

  @OneToMany( type => Test, t => t.year)
  tests: Test[]
}
