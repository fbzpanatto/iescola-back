import "reflect-metadata"
import { DataSource } from "typeorm"

import { Student } from "./entity/Student"
import { Classroom } from "./entity/Classroom";
import { School } from "./entity/School";
import { Test } from "./entity/Test";
import { StudentGradeTest } from "./entity/StudentGradeTest";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "1234",
  database: "iescoladb",
  synchronize: true,
  logging: true,
  entities: [Classroom, School, Student, Test, StudentGradeTest],
  subscribers: [],
  migrations: [],
})
