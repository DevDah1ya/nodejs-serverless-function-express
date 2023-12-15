import mongoose from "../connection.js";
import {SchemaTypes} from "mongoose";


const Schema=mongoose.Schema;
const studentSchema = new Schema({
    Name: { type:SchemaTypes.String , required:true },
    EnrNum: {type:SchemaTypes.String , required:true , unique:true},
    email: {type:SchemaTypes.String , required:true, unique:true},
    pass: {type:SchemaTypes.String , required:true},
    classes_joined: {type:SchemaTypes.Array},
    attendance:  {type:SchemaTypes.Array},
});

export const studentModel =mongoose.model('Students',studentSchema);