import { Column, PrimaryGeneratedColumn } from "typeorm";
import { Length } from "class-validator";

export abstract class Person {

  @PrimaryGeneratedColumn()
  id: number

  @Length(60)
  @Column()
  name: string

  @Column()
  active: boolean
}
