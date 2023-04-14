import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from "typeorm"
import { StudentGradeTest } from "./StudentGradeTest";
import { Year } from "./Year";
import { Bimester } from "./Bimester";

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

  @ManyToOne(type => Year, y => y.tests)
  year: Year

  @ManyToOne(type => Bimester, b => b.tests)
  bimester: Bimester
}
