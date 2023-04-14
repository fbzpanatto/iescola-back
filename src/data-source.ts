import "reflect-metadata"
import { DataSource } from "typeorm"

import { Bimester } from "./entity/Bimester";
import { Classroom } from "./entity/Classroom";
import { Discipline } from "./entity/Discipline";
import { School } from "./entity/School";
import { StudentGradeTest } from "./entity/StudentGradeTest";
import { Teacher } from "./entity/Teacher";
import { Year } from "./entity/Year";
import { Student } from "./entity/Student";
import { Test } from "./entity/Test";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "1234",
  database: "iescoladb",
  synchronize: true,
  logging: true,
  entities: [Bimester, Classroom, Discipline, School, Student, StudentGradeTest, Teacher, Test, Year],
  subscribers: [],
  migrations: [],
})
