import { Entity, Column, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import { Student } from "./Student";
import { Classroom } from "./Classroom";
import {Year} from "./Year";

@Entity()
export class StudentClassesHistory {

    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Student, (s) => s.studentClasses)
    student: Student

    @ManyToOne(() => Classroom, (c) => c.studentClasses)
    classroom: Classroom

    @Column({ nullable: true })
    startedAt: Date

    @Column({ nullable: true })
    endedAt: Date

    @ManyToOne(() => Year, (y) => y.studentClasses)
    year: Year

    @Column()
    active: boolean
}
