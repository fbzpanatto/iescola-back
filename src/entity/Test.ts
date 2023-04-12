import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from "typeorm"
import {StudentGradeTest} from "./StudentGradeTest";

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

  @OneToMany(() => StudentGradeTest, st => st.test)
  studentGradeTests: StudentGradeTest[];

}
