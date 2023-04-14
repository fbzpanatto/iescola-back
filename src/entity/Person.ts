import { Column, PrimaryGeneratedColumn, ManyToOne, Entity, TableInheritance } from "typeorm"
import { PersonType } from "./PersonType";

@Entity()
@TableInheritance({ column: { type: "varchar", name: "name", length: 60 } })
export class Person {

  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => PersonType, c => c.persons)
  personType: PersonType

  @Column()
  active: boolean
}
