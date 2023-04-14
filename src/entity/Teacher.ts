import { Entity, ManyToMany, JoinTable, OneToOne, JoinColumn, BaseEntity, PrimaryGeneratedColumn } from "typeorm"
import { Discipline } from "./Discipline";
import { Person} from "./Person";

@Entity()
export class Teacher extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Discipline)
  @JoinTable()
  disciplines: Discipline[]

  @OneToOne(() => Person, p => p.teacher)
  @JoinColumn()
  person: Person;
}
