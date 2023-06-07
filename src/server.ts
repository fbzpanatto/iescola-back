import express from 'express'

import { Router } from 'express';
import { AppDataSource } from "./data-source";

import authorization from "./middleware/authorization";

import { BimesterRouter } from "./routes/bimesterRouter";
import { ClassroomRouter } from "./routes/classroomRouter";
import { ClassCategoryRouter } from "./routes/classCategoryRouter";
import { DisciplineRouter } from "./routes/disciplineRouter";
import { SchoolRouter } from "./routes/schoolRouter";
import { StudentTestsRouter } from "./routes/studentTestsRouter";
import { StudentRouter } from "./routes/studentRouter";
import { TeacherRouter } from "./routes/teacherRouter";
import { TestRouter } from "./routes/testRouter";
import { YearRouter } from "./routes/yearRouter";
import { CategoryRouter } from "./routes/categoryRoutes";
import { TestCategoryRouter } from "./routes/testCategoryRouter";
import { TestClassesRouter } from "./routes/testClassesRouter";
import { TeacherDisciplineRouter} from "./routes/teacherDisciplineRouter";
import { UserRouter } from "./routes/userRouter";
import { LoginRouter } from "./routes/loginRouter";

const bodyParser = require('body-parser');

import { Application } from "express";

const app: Application = express();

app.use(bodyParser.json());

const cors = require('cors');

const route = Router()

app.use(cors({origin: true}));

route.use('/year', authorization, YearRouter)
route.use('/bimester', authorization, BimesterRouter)
route.use('/school', authorization, SchoolRouter)
route.use('/class-category', authorization, ClassCategoryRouter)
route.use('/classroom', authorization, ClassroomRouter)
route.use('/discipline', authorization, DisciplineRouter)

route.use('/category', authorization, CategoryRouter)

route.use('/teacher', authorization, TeacherRouter)
route.use('/teacher-discipline', authorization, TeacherDisciplineRouter)
route.use('/student', authorization, StudentRouter)

route.use('/test-category', authorization, TestCategoryRouter)
route.use('/test', authorization, TestRouter)
route.use('/test-classes', authorization, TestClassesRouter)
route.use('/student-tests', authorization, StudentTestsRouter)

route.use('/user', authorization, UserRouter)
route.use('/login', LoginRouter)

app.use(route)

AppDataSource.initialize()
  .then(() => {
    console.log('Connected to database')
    app.listen(3333, () => {
      console.log('Server is running on port 3333')
    })
  })
  .catch((error) => console.log(error))
