const express=require('express');
const cors=require('cors');
const mongoose=require('mongoose');
const socket=require('socket.io');
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

//SOCKET IO
const io=socket(server, { 
    cors:{ //cors para que se pueda conectar desde cualquier lugar
        origins:'*:*',//origins:'http://localhost:3000'
        credentials:true,
    },
});

global.onlineUsers= new Map();//mapa de usuarios conectados

io.on('connection',(socket)=>{//cuando se conecta un usuario
    global.chatSocket=socket;//socket de chat
    socket.on('add-user', (userId)=>{
        onlineUsers.set(userId, socket.id);//agrega el usuario al mapa
    });

    socket.on('send-msg', (data)=>{//cuando se envia un mensaje
        const sendUserSocket = onlineUsers.get(data.to);//socket del usuario a quien se envia el mensaje

        if(sendUserSocket){
            socket.to(sendUserSocket).emit('mag-receive', data.msg);//emite el mensaje al usuario a quien se envia el mensaje
        }
    })
});