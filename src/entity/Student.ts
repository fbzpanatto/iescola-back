import { Column, ManyToOne, OneToMany, ChildEntity } from "typeorm"
import { Classroom } from "./Classroom";
import { StudentGradeTest } from "./StudentGradeTest";
import { Person } from "./Person";

@ChildEntity()
export class Student extends Person {

  @Column({ nullable: true })
  ra: string

  @ManyToOne(type => Classroom, c => c.students)
  classroom: Classroom

  @OneToMany(type => StudentGradeTest, st => st.student)
  studentGradeTests: StudentGradeTest[];
}
