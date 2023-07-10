import { Request, Response, Router } from "express";
import { studentController } from "../controller/studentController";
import userHasPermission from "../middleware/havePermission";

export const StudentRouter = Router()

StudentRouter.get('/', userHasPermission,  (req: Request, res: Response) => {
  studentController.getAllStudents(req)
    .then(r => res.status(r.status).json({ method: req.method, resource: req.baseUrl, payload: r.data }))
})

StudentRouter.get('/:id', userHasPermission, (req: Request, res: Response) => {
  studentController.getOneStudent(req)
    .then(r => res.status(r.status).json({ method: req.method, resource: req.baseUrl, payload: r.data }))
})

StudentRouter.post('/', userHasPermission, (req: Request, res: Response) => {
  studentController.saveData(req.body)
    .then(r => res.status(r.status).json({ method: req.method, resource: req.baseUrl, payload: r.data }))
})

StudentRouter.put('/:id', userHasPermission,(req: Request, res: Response) => {
  studentController.updateOneStudent(req.params.id, req.body)
    .then(r => res.status(r.status).json({ method: req.method, resource: req.baseUrl, payload: r.data }))
})
//
// StudentRouter.get('/creation', (req: Request, res: Response) => {
//   studentController.testCreation()
//     .then(r => res.status(r.status).json({ method: req.method, resource: req.baseUrl, payload: r.data }))
// })
