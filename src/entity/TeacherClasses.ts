import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class TeacherClasses {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  active: boolean
}
