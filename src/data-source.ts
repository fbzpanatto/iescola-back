import "reflect-metadata"
import { DataSource } from "typeorm"

import { Bimester } from "./entity/Bimester";
import { Category } from "./entity/Category";
import { Classroom } from "./entity/Classroom";
import { ClassCategory } from "./entity/ClassCategory";
import { Discipline } from "./entity/Discipline";
import { School } from "./entity/School";
import { StudentClasses } from "./entity/StudentClasses";
import { StudentTests } from "./entity/StudentTests";
import { Teacher } from "./entity/Teacher";
import { Year } from "./entity/Year";
import { Student } from "./entity/Student";
import { Test } from "./entity/Test";
import { Person } from "./entity/Person";
import { TestCategory } from "./entity/TestCategory";
import { TeacherClasses } from "./entity/TeacherClasses";
import { TeacherDisciplines } from "./entity/TeacherDisciplines";
import { TestClasses } from "./entity/TestClasses";

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
    ClassCategory,
    Discipline,
    School,
    Student,
    StudentClasses,
    StudentTests,
    Test,
    TestCategory,
    TeacherClasses,
    TeacherDisciplines,
    TestClasses,
    Teacher,
    Year
  ],
  subscribers: [],
  migrations: [],
})
