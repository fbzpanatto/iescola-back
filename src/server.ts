
import express from 'express'

import { Router } from 'express';
import { AppDataSource } from "./data-source";

import { BimesterRouter } from "./routes/bimester-router";
import { ClassroomRouter } from "./routes/classroom-router";
import { DisciplineRouter } from "./routes/discipline-router";
import { SchoolRouter } from "./routes/school-router";
import { SgtRouter } from "./routes/studentGradeTest-router";
import { StudentRouter } from "./routes/student-router";
import { TeacherRouter } from "./routes/teacher-router";
import { TestRouter } from "./routes/test-router";
import { YearRouter } from "./routes/year-router";

const app = express();

const route = Router()

app.use(express.json())

route.use('/bimester', BimesterRouter)
route.use('/classroom', ClassroomRouter)
route.use('/discipline', DisciplineRouter)
route.use('/school', SchoolRouter)
route.use('/student-grade-test', SgtRouter)
route.use('/student', StudentRouter)
route.use('/teacher', TeacherRouter)
route.use('/test', TestRouter)
route.use('/year', YearRouter)

app.use(route)

AppDataSource.initialize()
  .then(() => {
    console.log('Connected to database')
    app.listen(3333, () => {
      console.log('Server is running on port 3333')
    })
  })
  .catch((error) => console.log(error))
