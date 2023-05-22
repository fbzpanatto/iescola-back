import {Entity, PrimaryGeneratedColumn, ManyToOne, Column} from "typeorm"
import { Test } from "./Test";
import { Classroom } from "./Classroom";
import {Teacher} from "./Teacher";

@Entity()
export class TestClasses {

  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne( type => Test, t => t.testClasses)
  test: Test

  @ManyToOne( type => Classroom, c => c.testClasses)
  classroom: Classroom

  @ManyToOne( type => Teacher, t => t, { nullable: true })
  testGiver: Teacher
}
