import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm"
import { Max } from "class-validator";
import {Person} from "./Person";

@Entity()
export class PersonType {

  @PrimaryGeneratedColumn()
  id: number

  @Max(60)
  @Column({unique: true})
  name: string

  @OneToMany(type => Person, p => p.personType)
  persons: Person[]

  @Column()
  active: boolean
}
