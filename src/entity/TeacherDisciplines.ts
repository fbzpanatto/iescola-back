import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm"
import { Teacher } from "./Teacher";
import { Discipline } from "./Discipline";

@Entity()
export class TeacherDisciplines {

  @PrimaryGeneratedColumn()
  id: number

  @Column({nullable: true})
  statedAt: Date;

  @Column({nullable: true})
  endedAt: Date;

  @ManyToOne(() => Discipline, d => d.teacherDisciplines)
  discipline: Discipline;

  @ManyToOne(() => Teacher, t => t.teacherDisciplines)
  teacher: Teacher;
}