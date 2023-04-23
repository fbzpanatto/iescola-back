import { Entity, Column, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import { Student } from "./Student";
import { Test } from "./Test";

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

  @Column({ nullable: true })
  grade: number;

  @ManyToOne(() => Student, (s) => s.studentTests)
  student: Student

  @ManyToOne(() => Test, (t) => t.studentTests)
  test: Test
}
