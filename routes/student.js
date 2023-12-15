import  express  from "express";
import { studentController } from "../Controllers/student.js";
const studentRoutes=express.Router();

studentRoutes.post('/signup',studentController.register);
studentRoutes.post('/login',studentController.login);
studentRoutes.post('/getAttendance/:uid',studentController.login);
studentRoutes.post('/joinClass',studentController.joinClass);

export default studentRoutes;