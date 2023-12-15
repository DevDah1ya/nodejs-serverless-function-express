import mongoose from "../connection.js";
import {SchemaTypes} from "mongoose";


const Schema=mongoose.Schema;
const teacherSchema = new Schema({
    Name:  {type:SchemaTypes.String},
    Emp_Code:  {type:SchemaTypes.String},
    email:  {type:SchemaTypes.String},  
    pass:  {type:SchemaTypes.String},
    classes_created:  {type:SchemaTypes.Array},
});

export const teacherModel=mongoose.model('teacher',teacherSchema);