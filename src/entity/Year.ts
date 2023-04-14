import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm"
import { IsInt, Length } from "class-validator";
import { Classroom } from "./Classroom";
import {Test} from "./Test";

@Entity()
export class Year {

  @PrimaryGeneratedColumn()
  id: number

  @Length(4, 4)
  @IsInt()
  @Column({ unique: true})
  name: number

  @Column()
  active: boolean

  @OneToMany(type => Classroom, c => c.year)
  classrooms: Classroom[]

  @OneToMany( type => Test, t => t.year)
  tests: Test[]
}
