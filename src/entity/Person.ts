import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, ManyToOne } from "typeorm";
import { Student } from "./Student";
import { Teacher } from "./Teacher";
import { Category } from "./Category";

@Entity()
export class Person extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(type => Category, c => c.persons)
  category: Category;

  @OneToOne(type => Student, s => s.person)
  student: Student;

  @OneToOne(type => Teacher, t => t.person)
  teacher: Teacher;
}
