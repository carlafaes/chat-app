const User= require('../model/userModel');
const bcrypt=require('bcrypt');

module.exports.register= async (req,res,next)=>{
    console.log('controller register', req.body);
    try{

        const {username,email,password}=req.body;
        const usernameCheck= await User.findOne({username});
        if(usernameCheck){
            return res.status(400).json({
                message:'username already exists',
                status:false
            });
        }
        const emailCheck= await User.findOne({email});
        if(emailCheck){
            return res.status(400).json({
                message:'email already exists',
                status:false
            });
        }
        const hashedPassword= await bcrypt.hash(password,10);

        const user= await User.create({
            username,
            email,
            password:hashedPassword
        })
        delete user.password;
        return res.status(201).json({status:true, user});
    }
    catch(err){
        return res.status(500).json({
            message:'error registering user',
            error:err
        });
    }
}