import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from "typeorm"
import { StudentTests } from "./StudentTests";
import { Year } from "./Year";
import { Bimester } from "./Bimester";
import { Teacher } from "./Teacher";
import { Discipline } from "./Discipline";
import { TestCategory } from "./TestCategory";
import { TestClasses } from "./TestClasses";

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

  @Column({select: false})
  active: boolean

  @OneToMany(type => StudentTests, st => st.test)
  studentTests: StudentTests[];

  @OneToMany( type => TestClasses, t => t.test, { eager: true })
  testClasses: TestClasses[]

  @ManyToOne(type => Year, y => y.tests, { eager: true })
  year: Year

  @ManyToOne(type => TestCategory, tc => tc.tests, { eager: true })
  category: TestCategory

  @ManyToOne(type => Bimester, b => b.tests, { eager: true })
  bimester: Bimester

  @ManyToOne(type => Teacher, t => t.tests, { eager: true })
  teacher: Teacher

  @ManyToOne(type => Discipline, d => d.tests, { eager: true })
  discipline: Discipline
}
