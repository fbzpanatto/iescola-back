import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm"
import { Max } from "class-validator";
import { Teacher } from "./Teacher";
import { Student } from "./Student";
import {Person} from "./Person";
import {Test} from "./Test";

@Entity()
export class TestCategory {

  @PrimaryGeneratedColumn()
  id: number

  @Max(60)
  @Column({unique: true})
  name: string

  @Column({select: false})
  active: boolean

  @OneToMany(()=> Test, t => t.category)
  tests: Test[]
}
