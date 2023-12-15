import mongoose from "mongoose";
const URL='mongodb+srv://devdahiya2477:EJEaSUURBxJLzllB@mongocluster.4hze2qt.mongodb.net/?retryWrites=true&w=majority';
const promise=mongoose.connect(URL);
promise.then(data=>{
    console.log('Db Connected . .');
}).catch(err=>{
    
    console.log(err);
})
export default mongoose;