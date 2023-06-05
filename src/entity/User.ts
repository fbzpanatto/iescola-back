import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn} from "typeorm";
import { Person } from "./Person";

@Entity()
export class User extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  user: string;

  @Column( { nullable: true } )
  password: string;

  @OneToOne(type => Person, p => p.user)
  @JoinColumn()
  person: Person;
}
