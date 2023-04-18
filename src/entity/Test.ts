import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from "typeorm"
import { StudentGradeTest } from "./StudentGradeTest";
import { Year } from "./Year";
import { Bimester } from "./Bimester";
import { Teacher } from "./Teacher";
import { Discipline } from "./Discipline";

@Entity()
export class Test {

  @PrimaryGeneratedColumn()
  id: number

  @Column({
    length: 100
  })
  name: string

  @Column('json')
  questions: { id: number, answer: string }[];

  @Column()
  active: boolean

  @OneToMany(type => StudentGradeTest, st => st.test)
  studentGradeTests: StudentGradeTest[];

  @ManyToOne(type => Year, y => y.tests, { nullable: false })
  year: Year

  @ManyToOne(type => Bimester, b => b.tests, { nullable: false })
  bimester: Bimester

  @ManyToOne(type => Teacher, t => t.tests, { nullable: false })
  teacher: Teacher

  @ManyToOne(type => Discipline, d => d.tests, { nullable: false })
  discipline: Discipline
}
