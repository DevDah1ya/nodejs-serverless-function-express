import express from 'express';
import cors from 'cors';
import studentRoutes from './routes/student.js';
import teacherRoutes from './routes/teacher.js';
// import verifytoken from './Middleware/verifyToken.js';

const app=express();

app.use(cors());// cross orgin 
app.use(express.json()); //json nikalta hai (next)

// app.use('/verifyToken',verifytoken);
app.use('/teacher/',teacherRoutes);
app.use('/student/',studentRoutes);
//last middleware
app.use((req,res,next)=>{
    res.json({message:'Invalid URL'});
})

const server=app.listen(1234,(err)=>{
    if(err){
        console.log('server crash',err);
    }
    else{
        console.log('server up and running', server.address().port);
    }
})