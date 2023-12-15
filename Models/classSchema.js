import mongoose from "../connection.js";
import {SchemaTypes} from "mongoose";


const Schema=mongoose.Schema;
const classSchema = new Schema({
    Class_code:  {type:SchemaTypes.String},
    totalStudents: {type:SchemaTypes.Array},
    created_by: { type: mongoose.SchemaTypes.String, ref: "Teacher" },
    Class_description: {type:SchemaTypes.String},
    Class_title: {type:SchemaTypes.String},
    lectures: {type:SchemaTypes.Array},
});

export const classModel=mongoose.model('class',classSchema);