import "reflect-metadata"
import { DataSource } from "typeorm"

import { Bimester } from "./entity/Bimester";
import { Category } from "./entity/Category";
import { Classroom } from "./entity/Classroom";
import { ClassCategory } from "./entity/ClassCategory";
import { Discipline } from "./entity/Discipline";
import { School } from "./entity/School";
import { StudentClassesHistory } from "./entity/StudentClassesHistory";
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
import { User } from "./entity/User";

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
    StudentClassesHistory,
    StudentTests,
    Test,
    TestCategory,
    TeacherClasses,
    TeacherDisciplines,
    TestClasses,
    Teacher,
    User,
    Year
  ],
  subscribers: [],
  migrations: [],
})
