import { Entity, Column, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import { Student } from "./Student";
import { Test } from "./Test";
import {type} from "os";
import {Classroom} from "./Classroom";

@Entity()
export class StudentTests {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  studentId: number

  @Column()
  testId: number

  @Column('json', { nullable: true })
  studentAnswers: { id: number, answer: string }[];

  @Column( { nullable: true })
  completed: boolean;

  @Column({ nullable: true})
  score: number;

  @ManyToOne(() => Classroom, (c) => c.registeredInClass, { nullable: true })
  registeredInClass: Classroom

  @ManyToOne(() => Student, (s) => s.studentTests)
  student: Student

  @ManyToOne(() => Test, (t) => t.studentTests)
  test: Test
}
