import { Column, ManyToOne, OneToMany, Entity, OneToOne, JoinColumn, PrimaryGeneratedColumn, BaseEntity } from "typeorm"
import { Classroom } from "./Classroom";
import { StudentTests } from "./StudentTests";
import { Person } from "./Person";

@Entity()
export class Student extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ra: string;

  @OneToOne(() => Person, {eager: true})
  @JoinColumn()
  person: Person;

  @ManyToOne(type => Classroom, c => c.students, {cascade: true})
  classroom: Classroom

  @OneToMany(type => StudentTests, st => st.student, {cascade: true})
  studentTests: StudentTests[];
}
