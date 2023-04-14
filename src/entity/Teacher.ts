import { Entity, ManyToMany, JoinTable, ManyToOne } from "typeorm"
import { Discipline } from "./Discipline";
import { Person} from "./Person";
import { Category } from "./Category";

@Entity()
export class Teacher extends Person {

  @ManyToMany(() => Discipline)
  @JoinTable()
  disciplines: Discipline[]

  @ManyToOne(type => Category, category => category.teachers)
  category: Category
}
