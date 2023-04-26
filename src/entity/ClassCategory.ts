import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm"
import { Max } from "class-validator";
import {Classroom} from "./Classroom";

@Entity()
export class ClassCategory {

    @PrimaryGeneratedColumn()
    id: number

    @Max(10)
    @Column({unique: true})
    name: string

    @Column({select: false, default: true})
    active: boolean

    @OneToMany( type => Classroom, classroom => classroom.category)
    classrooms: Classroom[]
}
