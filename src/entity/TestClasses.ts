import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm"
import { Test } from "./Test";
import { Classroom } from "./Classroom";

@Entity()
export class TestClasses {

  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne( type => Test, t => t.testClasses)
  test: Test

  @ManyToOne( type => Classroom, c => c.testClasses, { eager: true })
  classroom: Classroom
}
