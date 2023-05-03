
import express from 'express'

import { Router } from 'express';
import { AppDataSource } from "./data-source";

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


const bodyParser = require('body-parser');

import { Application } from "express";
import {TestClassesRouter} from "./routes/testClassesRouter";

const app: Application = express();

app.use(bodyParser.json());

const cors = require('cors');

const route = Router()

app.use(cors({origin: true}));

route.use('/year', YearRouter)
route.use('/bimester', BimesterRouter)
route.use('/school', SchoolRouter)
route.use('/class-category', ClassCategoryRouter)
route.use('/classroom', ClassroomRouter)
route.use('/discipline', DisciplineRouter)

route.use('/category', CategoryRouter)

route.use('/teacher', TeacherRouter)
route.use('/student', StudentRouter)

route.use('/test-category', TestCategoryRouter)
route.use('/test', TestRouter)
route.use('/test-classes', TestClassesRouter)
route.use('/student-tests', StudentTestsRouter)

app.use(route)

AppDataSource.initialize()
  .then(() => {
    console.log('Connected to database')
    app.listen(3333, () => {
      console.log('Server is running on port 3333')
    })
  })
  .catch((error) => console.log(error))
