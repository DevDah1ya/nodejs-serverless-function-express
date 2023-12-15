import { teacherModel } from "../Models/teacherSchema.js";
import { classModel } from "../Models/classSchema.js";
import { studentModel } from "../Models/studentSchema.js";
import { lectureModel } from "../Models/lectureSchema.js";
import { hashing } from "../utils/encrypt.js";
import jwt from "jsonwebtoken";
import randomstring from "randomstring";



export const teacherController = {

  // email or EnrNum and password
  // @@ /teacher/login
  login: async (req, res) => {
    const body = req.body;
    let result;
    if (body.email) {
      result = await teacherModel.findOne({ email: body.email }).exec();
    } else if (body.Emp_Code) {
      result = await teacherModel.findOne({ EnrNum: body.Emp_Code }).exec();
    } else {
      res.json({
        status: 404,
        message: "no email or EnrNum",
      });
    }

    if (result && result._id) {
      console.log(body.pass);
      console.log(result.pass);
      const plainPassword = body.pass;
      const dbPassword = result.pass;
      if (hashing.matchPassword(plainPassword, dbPassword)) {
        const data = {
          userdata: result,
          Mid: result.Mid,
        };
        const authtoken = jwt.sign(data, "secret");
        const success = true;
        res.json({
          status: 200,
          authtoken,
        });
      } else {
        res.json({
          status: 400,
          message: "invalid userid or password",
        });
      }
    } else {
      res.json({ message: "invalid userid or password" });
    }
  },


  // Name || pass ||Emp_Code || email
  //  @@  /teacher/signup

  register: async (req, res) => {
    const userInfo = req.body;
    if (
      !userInfo.Name ||
      !userInfo.pass ||
      !userInfo.Emp_Code ||
      !userInfo.email
    ) {
      res.json({
        status: 404,
        message: "incomplete credentials",
      });
    } else {
      userInfo.pass = hashing.passwordHash(userInfo.pass);

      try {
        const result = await teacherModel.create(userInfo);
        if (result && result._id) {
          res.json({
            status: 200,
            message: "registered sucessesfully",
          });
        } else {
          res.json({ status: 400, message: "not registered" });
        }
      } catch (err) {
        res.json({ status: 400, message: "not registered" });
        console.log(err);
      }
    }
  },

  // created_by, Class_description, Class_title
  // @@ /teacher/createClass
  createClass: async (req, res) => {
    let classData = req.body;
    let classCode = randomstring.generate(5);
    classData.Class_code = classCode;
    const result = await classModel.create(classData);
    if (result && result._id) {
      res.json({
        status: 200,
        message: "Class created sucessesfully",
        classCode: classCode,
      });
    }
  },

  // required teacher id as parameter in link 
  // @@  /teacher/getClasses/1
  getClasses: async (req, res) => {
    console.log("Get classes requested", req.params.uid);
    const n_classes = await teacherModel.findOne({
      Emp_Code: String(req.params.uid),
    });
    if (n_classes) {
      const soln = []; // Declare soln using const
      for (const x of n_classes.classes_created) {
        const ith_class = await classModel.findById({ _id: x });
        if (ith_class) {
          soln.push(ith_class);
        }
      }
      res.json({ resp: "ok", payload: soln });
    } else {
      console.log("No matching record found (teacher)", req.body);
      res.json({ id: "" });
    }
  },

  // class code
  // @@ teacher/createLecture 
  createLecture: async(req,res) =>{
    let data = req.body;
    if(!data.class_code){
      res.status(404).json({message:" no class code"});
    }
      data.date = new Date();
      const result = await lectureModel.create(req.body);
      if(result){
        res.status(200).json({message:'Lecture added to the database' , lectureID : result._id});
      }
  },

  markPresent: async (req, res) => {
    try {
      const data = req.body;
      const presentStudents = data.presentStudents;
      const lectureID = data.lectureID;
      const classCode = data.classCode;
  
      // Update the Presentees in the lectureModel
      const lectureResult = await lectureModel.findOneAndUpdate(
        { _id: lectureID },
        { $push: { Presentees: { $each: presentStudents } } },
        { new: true }
      );
  
      if (!lectureResult) {
        return res.json({ status: 404, message: "Lecture not found" });
      }
  
      // Update the attendance in the studentModel
      const updateResult = await studentModel.updateMany(
        { EnrNum: { $in: presentStudents }, classes_joined: classCode },
        { $push: { attendance: lectureID } }
      );
      console.log(updateResult);
  
      if (updateResult.modifiedCount > 0) {
        return res.json({ status: 200, message: "Attendance marked successfully" });
      } else {
        return res.json({ status: 404, message: "No matching students found or not joined the class" });
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
  },  

  getEnrolledStudents: async (req, res) => {
    try {
      const classCode = req.body.class_code;
  
      const enrolledStudents = await studentModel.find({
        classes_joined: classCode
      });
      console.log(enrolledStudents);
      if (enrolledStudents.length > 0) {
        // Students found, send the data through JSON
        res.json({ status: 200, enrolledStudents });
      } else {
        // No matching students found
        res.json({ status: 404, message: "No enrolled students found for the given class code" });
      }
    } catch (error) {
      console.error("Error retrieving enrolled students:", error);
      res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
  },
  

  getTeacherById: async(req,res) =>{
    const teacherId=req.body.Emp_code;

    const result = await teacherModel.findOne({Emp_Code : teacherId});

    if(result)
    {
      return res.status(200).json({status : 200 , teacherInfo : result});
    }
    else{
      return res.status(404).json({status : 404 ,message : "Invalid Teacher ID!"})
    }
  } ,
  getStudentById: async(req,res) =>{
    const studentId=req.body.EnrNum;
    console.log(studentId);
    const result = await studentModel.findOne({EnrNum : studentId});
    console.log(result);
    if(result)
    {
      return res.status(200).json({status : 200 , data : result});
    }
    else{
      return res.status(404).json({status : 404 ,message : "Invalid Student ID!"})
    }
  } ,
  
};
