import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm"
import { Length } from "class-validator";
import { Test } from "./Test";

@Entity()
export class Bimester {

  @PrimaryGeneratedColumn()
  id: number

  @Length(4, 4)
  @Column({ unique: true})
  name: string

  @Column({select: false})
  active: boolean

  @OneToMany( type => Test, t => t.year)
  tests: Test[]
}
