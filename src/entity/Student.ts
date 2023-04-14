import { Column, ManyToOne, OneToMany, Entity } from "typeorm"
import { Classroom } from "./Classroom";
import { StudentGradeTest } from "./StudentGradeTest";
import { Person } from "./Person";
import { Category } from "./Category";

@Entity()
export class Student extends Person {

  @Column()
  ra: string

  @ManyToOne(type => Classroom, c => c.students)
  classroom: Classroom

  @OneToMany(type => StudentGradeTest, st => st.student)
  studentGradeTests: StudentGradeTest[];

  @ManyToOne(type => Category, category => category.students)
  category: Category
}
