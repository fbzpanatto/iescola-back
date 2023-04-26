import { Entity, Column, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import { Student } from "./Student";
import { Classroom } from "./Classroom";

@Entity()
export class StudentClasses {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: true })
    startedAt: Date

    @Column({ nullable: true })
    endedAt: Date

    @Column({ default: true})
    active: boolean

    @ManyToOne(() => Student, (s) => s.studentClasses)
    student: Student

    @ManyToOne(() => Classroom, (c) => c.studentClasses)
    classroom: Classroom
}
