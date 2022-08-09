const express=require('express');
const cors=require('cors');
const mongoose=require('mongoose');

//routes
const userRoutes=require('./routes/userRoutes');
const messagesRoutes=require('./routes/messagesRoutes');


const app=express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use('/api/auth',userRoutes);
app.use('/api/messages',messagesRoutes);

const adminPassword = encodeURIComponent( process.env.MONGODB_PASS )
//CONNECT TO MONGO DB
mongoose.connect(process.env.MONGO_URL,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>console.log('DB Connected'))
.catch(err=>console.log(err));

const server= app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})

