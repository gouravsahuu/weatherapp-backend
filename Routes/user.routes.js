const express = require("express");
const {UserModel} = require("../Models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const tokenKey = process.env.tokenKey;
const refTokenKey = process.env.refTokenKey;
const {client} = require("../index");

const userRoute = express.Router();

userRoute.post("/register",async (req,res) => {
    const {name,email,password,city} = req.body;
    try{
        const userExists = await UserModel.find({email});
        if(userExists.length == 0){
            bcrypt.hash(password, 5,async (err, hash) => {
                if(hash){
                const userDetails = new UserModel({name,email,password:hash,city});
                await userDetails.save();
                res.send({"message":"User registered successfully"});
                }
                else{
                res.send({"error":err.message});
                }
            });
        }   
        else{
            res.send({"message":"user already exists"});
        }
    }
    catch(err){
        res.send({"message":"Something went wrong","error":err.message});
    }
})

userRoute.post("/login",async(req,res) => {
    const {email,password} = req.body;
    try{
        const userExist = await UserModel.find({email});
        if(userExist.length > 0){
            bcrypt.compare(password, userExist[0].password, (err,result) => {
                if(result){
                    const token = jwt.sign({ userID : userExist[0]._id }, tokenKey, { expiresIn: '5m' });
                    const refToken = jwt.sign({ userID : userExist[0]._id }, refTokenKey, { expiresIn: '15m' });
                    res.send({"message":"Login Successfull","token":token,"refToken":refToken});
                }
                else{
                    res.send({"message":"Invalid credentials"});
                }
            })
        }
        else{
            res.send({"message":"Invalid credentials"});
        }
    }
    catch(err){
        res.send({"message":"Something went wrong","error":err.message});
    }
})

userRoute.get("/logout",async (req,res) => {
    const tokenss = req.headers.authorization.split(" ")[1];
    await client.set(`${tokenss}`,"true");
    res.send({"message":"Logout Successfull"});
})

module.exports = {userRoute};