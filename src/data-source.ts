import "reflect-metadata"
import { DataSource } from "typeorm"

import { Bimester } from "./entity/Bimester";
import { Category } from "./entity/Category";
import { Classroom } from "./entity/Classroom";
import { Discipline } from "./entity/Discipline";
import { School } from "./entity/School";
import { StudentGradeTest } from "./entity/StudentGradeTest";
import { Teacher } from "./entity/Teacher";
import { Year } from "./entity/Year";
import { Student } from "./entity/Student";
import { Test } from "./entity/Test";
import { Person } from "./entity/Person";
import { TestCategory } from "./entity/TestCategory";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "1234",
  database: "iescoladb",
  synchronize: true,
  logging: false,
  entities: [
    Bimester,
    Person,
    Category,
    Classroom,
    Discipline,
    School,
    Student,
    StudentGradeTest,
    TestCategory,
    Teacher,
    Test,
    Year
  ],
  subscribers: [],
  migrations: [],
})
