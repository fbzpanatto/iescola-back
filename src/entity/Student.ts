import { Column, OneToMany, Entity, OneToOne, JoinColumn, PrimaryGeneratedColumn, BaseEntity } from "typeorm"
import { StudentTests } from "./StudentTests";
import { Person } from "./Person";
import { StudentClasses } from "./StudentClasses";

@Entity()
export class Student extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  no: number

  @Column({ unique: true, nullable: true })
  ra: string;

  @OneToOne(() => Person, {eager: true})
  @JoinColumn()
  person: Person;

  @Column({ default: true, select: false })
  active: boolean;

  @OneToMany( type => StudentClasses, sc => sc.student)
  studentClasses: StudentClasses[];

  @OneToMany(type => StudentTests, st => st.student)
  studentTests: StudentTests[];
}
