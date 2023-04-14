import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm"
import { Max } from "class-validator";
import { Teacher } from "./Teacher";
import { Student } from "./Student";
import {Person} from "./Person";

@Entity()
export class Category {

  @PrimaryGeneratedColumn()
  id: number

  @Max(60)
  @Column({unique: true})
  name: string

  @Column()
  active: boolean

  @OneToMany(()=> Person, p => p.category)
  persons: Person[]
}
