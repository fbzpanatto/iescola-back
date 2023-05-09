import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm"
import { Teacher } from "./Teacher";
import { Discipline } from "./Discipline";

@Entity()
export class TeacherDisciplines {

  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Discipline, d => d.teacherDisciplines, {eager: true})
  discipline: Discipline;

  @ManyToOne(() => Teacher, t => t.teacherDisciplines)
  teacher: Teacher;

  @Column({nullable: true})
  statedAt: Date;

  @Column({nullable: true})
  endedAt: Date;

  @Column({ default: true})
  active: boolean
}
