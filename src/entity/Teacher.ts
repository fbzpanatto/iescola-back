import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Teacher {

  @PrimaryGeneratedColumn()
  id: number

  @Column({
    length: 60,
  })
  name: string

  @Column()
  active: boolean
}
