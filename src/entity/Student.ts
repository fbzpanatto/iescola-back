import {Column, OneToMany, Entity, OneToOne, JoinColumn, PrimaryGeneratedColumn, BaseEntity, ManyToOne} from "typeorm"
import { StudentTests } from "./StudentTests";
import { Person } from "./Person";
import { StudentClassesHistory } from "./StudentClassesHistory";
import {Classroom} from "./Classroom";

@Entity()
export class Student extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  no: number

  @Column({ unique: true, nullable: true })
  ra: string;

  @Column({ nullable: true })
  dv: string;

  @Column({ nullable: true })
  state: string;

  @OneToOne(() => Person, {eager: true, cascade: true})
  @JoinColumn()
  person: Person;

  @ManyToOne( type => Classroom, c => c.students)
  classroom: Classroom;

  @Column({ default: true, select: false })
  active: boolean;

  @OneToMany( type => StudentClassesHistory, sc => sc.student)
  studentClasses: StudentClassesHistory[];

  @OneToMany(type => StudentTests, st => st.student)
  studentTests: StudentTests[]
}
