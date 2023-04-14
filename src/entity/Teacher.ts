import {Entity, Column, ManyToMany, JoinTable, ChildEntity} from "typeorm"
import { Discipline } from "./Discipline";
import { Person} from "./Person";

@ChildEntity()
export class Teacher extends Person {

  @ManyToMany(() => Discipline)
  @JoinTable()
  disciplines: Discipline[]
}
