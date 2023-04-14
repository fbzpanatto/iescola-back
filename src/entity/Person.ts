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

  @ManyToOne(() => Category, c => c.persons)
  category: Category;

  @OneToOne(type => Student, s => s.person, {
    cascade: true
  })
  student: Student;

  @OneToOne(() => Teacher)
  teacher: Teacher;
}
