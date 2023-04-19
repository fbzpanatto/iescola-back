import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from "typeorm"
import { StudentTests } from "./StudentTests";
import { Year } from "./Year";
import { Bimester } from "./Bimester";
import { Teacher } from "./Teacher";
import { Discipline } from "./Discipline";
import { TestCategory } from "./TestCategory";

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

  @ManyToOne(type => Year, y => y.tests, { nullable: false, eager: true })
  year: Year

  @ManyToOne(type => TestCategory, tc => tc.tests, { nullable: false, eager: true })
  category: TestCategory

  @ManyToOne(type => Bimester, b => b.tests, { nullable: false, eager: true })
  bimester: Bimester

  @ManyToOne(type => Teacher, t => t.tests, { nullable: false, eager: true })
  teacher: Teacher

  @ManyToOne(type => Discipline, d => d.tests, { nullable: false, eager: true })
  discipline: Discipline

  //TODO: add test category
}
