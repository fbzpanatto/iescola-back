import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Discipline {

  @PrimaryGeneratedColumn()
  id: number

  @Column({
    length: 60,
  })
  name: string

  @Column()
  active: boolean
}
