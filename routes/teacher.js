import  express  from "express";
import { teacherController } from "../Controllers/teacher.js";
const teacherRoutes=express.Router();

teacherRoutes.post('/signup',teacherController.register);
teacherRoutes.post('/login',teacherController.login);
teacherRoutes.post('/getAttendance/:uid',teacherController.login);
teacherRoutes.post('/createClass/',teacherController.createClass);
teacherRoutes.get('/getClasses/:uid',teacherController.getClasses);
teacherRoutes.post('/createLecture',teacherController.createLecture);
teacherRoutes.post('/markPresent',teacherController.markPresent);
teacherRoutes.get('/getEnrolledStudents',teacherController.getEnrolledStudents);
teacherRoutes.get('/getTeacherById',teacherController.getTeacherById);
teacherRoutes.get('/getStudentById',teacherController.getStudentById);

export default teacherRoutes;