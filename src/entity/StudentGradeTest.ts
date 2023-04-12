import {Entity, Column, PrimaryColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import { Student } from "./Student";
import { Test } from "./Test";

@Entity()
export class StudentGradeTest {

  @PrimaryGeneratedColumn()
  studentGradeTestId: number

  @Column()
  studentId: number

  @Column()
  testId: number

  @Column('json')
  studentAnswers: { id: number, answer: string }[];

  @ManyToOne(() => Student, (s) => s.studentGradeTests)
  student: Student

  @ManyToOne(() => Test, (t) => t.studentGradeTests)
  test: Test
}
