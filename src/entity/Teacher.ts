import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm"
import { Discipline } from "./Discipline";

@Entity()
export class Teacher {

  @PrimaryGeneratedColumn()
  id: number

  @Column({
    length: 60,
  })
  name: string

  @ManyToMany(() => Discipline)
  @JoinTable()
  disciplines: Discipline[]

  @Column()
  active: boolean
}
