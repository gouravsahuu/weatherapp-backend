const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name : {type:String,required:true},
    email : {type:String,required:true},
    password : {type:String,required:true},
    city : {type:String,required:true}
})

const UserModel = mongoose.model("users",userSchema);

module.exports = {UserModel};