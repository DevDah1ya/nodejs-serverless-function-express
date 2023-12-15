import mongoose from "../connection.js";
import {SchemaTypes} from "mongoose";

const Schema=mongoose.Schema;
const lectureSchema = new Schema({
    class_code:  {type:SchemaTypes.String , required: true},
    date:  {type:SchemaTypes.Date},
    Presentees:  {type:SchemaTypes.Array},
});

export const lectureModel=mongoose.model('lectures',lectureSchema);