import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm"
import { Teacher } from "./Teacher";
import { Classroom } from "./Classroom";

@Entity()
export class TeacherClasses {

  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable:false } )
  startedAt: Date

  @Column({ nullable:true} )
  endedAt: Date

  @ManyToOne(() => Teacher, (t) => t.teacherClasses, { eager: true, nullable:false })
  teacher: Teacher

  @ManyToOne(() => Classroom, (c) => c.teacherClasses, { eager: true, nullable:false})
  classroom: Classroom
}
