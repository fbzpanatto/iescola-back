import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm"
import { Classroom } from "./Classroom";

@Entity()
export class School {

  @PrimaryGeneratedColumn()
  id: number

  @Column({
    unique: true}
  )
  inep: string

  @Column({
    length: 100,
    unique: true
  })
  name: string

  @Column()
  active: boolean

  @OneToMany(type => Classroom, c => c.school)
  classrooms: Classroom[]
}
