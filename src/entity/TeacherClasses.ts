import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from "typeorm"
import { Classroom } from "./Classroom";
import { Teacher } from "./Teacher";

@Entity()
export class TeacherClasses {

  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Classroom, c => c.teacherClasses, {eager: true})
  classroom: Classroom;

  @ManyToOne(() => Teacher, t => t.teacherClasses)
  teacher: Teacher;
}
