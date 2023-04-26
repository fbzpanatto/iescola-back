import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm"
import { Classroom } from "./Classroom";

@Entity()
export class School {

  @PrimaryGeneratedColumn()
  id: number

  @Column({
    length: 100,
    unique: true
  })
  name: string

  @Column({unique: true, nullable: true} )
  inep: string

  @Column({select: false, default: true})
  active: boolean

  @OneToMany(type => Classroom, c => c.school)
  classrooms: Classroom[]
}
