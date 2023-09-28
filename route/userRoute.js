
const express = require('express');
const {UserModel}=require("../model/userModel")
const bcrypt=require('bcrypt');
const jwt=require("jsonwebtoken");
const userRouter=express.Router();


userRouter.post("/register",async(req,res)=>{

    try{
        const {email}=req.body;
        const user =await UserModel.findOne({email})
        if(user){
            res.status(200).send({"msg":"user already registered place login"})
        }
        else{
            const{email,password,image,username}=req.body;
            bcrypt.hash(password,5 ,async(err,hash)=>{
                if(err){
                res.send({"msg":err.message})
                }
                else{

                    const newUser =new UserModel({email,password:hash,image,username})
                    await newUser.save();
                    res.status(200).send({"msg":"successfully registered place login"})
                }
            })
        }
    }
    catch(err){
        console.log(err);
    }
})

userRouter.post("/login",async(req,res)=>{
    const {email}=req.body;
    
   const user = await UserModel.findOne({email})
 
    if(user){
        var token= jwt.sign({userID:user._id,username:user.username},"tanuj",{expiresIn:"7d"});
        res.status(200).send({token:token});
    }
    else{
        res.status(400).send({"msg":"Invalid email or password"});
    }
})


module.exports={userRouter}