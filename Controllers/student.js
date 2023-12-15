import { classModel } from "../Models/classSchema.js";
import { studentModel } from "../Models/studentSchema.js";
import { hashing } from "../utils/encrypt.js";
import jwt from "jsonwebtoken";

export const studentController = {
  login: async (req, res) => {
    const body = req.body;
    let result;
    if(body.email){
       result = await studentModel.findOne({ email: body.email }).exec();
    }
    else if(body.EnrNum){
       result = await studentModel.findOne({ EnrNum : body.EnrNum}).exec() ;
    }
    else{
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

  register: async (req, res) => {
    const userInfo = req.body;
    if (!userInfo.Name || !userInfo.pass || !userInfo.EnrNum || !userInfo.email) {
      res.json({
        status: 404,
        message: "incomplete credentials",
      });
    } else {
      userInfo.pass = hashing.passwordHash(userInfo.pass);

      try {
        const result = await studentModel.create(userInfo);
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

  joinClass: async (req, res) => {
    const classCode = req.body.classCode;
    const EnrNum = req.body.EnrNum;
  
    try {
      const updatedStudent = await studentModel.findOneAndUpdate(
        { EnrNum: EnrNum, 'classes_joined': { $ne: classCode } },
        { $push: { classes_joined: classCode } },
        { new: true }
      );
  
      if (updatedStudent) {
        // Update totalStudents in the classModel
        const updatedClass = await classModel.findOneAndUpdate(
          { Class_code:classCode },
          { $push: { totalStudents: EnrNum } },
          { new: true }
        );
  
        if (updatedClass) {
          res.json({ status: 200, message: "Class joined successfully" });
        } else {
          res.json({ status: 400, message: "Class not found or could not be updated" });
        }
      } else {
        res.json({ status: 400, message: "Student already joined this class or not found" });
      }
    } catch (error) {
      console.error("Error joining class:", error);
      res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
  }  

};
