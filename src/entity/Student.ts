import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm"
import { Classroom } from "./Classroom";

@Entity()
export class Student {

  @PrimaryGeneratedColumn()
  id: number

  @Column({
    length: 100
  })
  name: string

  @Column({
    length: 20
  })
  ra: string

  @Column()
  active: boolean

  @ManyToOne(type => Classroom, c => c.students)
  classroom: Classroom
}
