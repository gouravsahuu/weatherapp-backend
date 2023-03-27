const express = require("express");
const {createClient} = require("redis");
require("dotenv").config();
const port = process.env.port;
const {connection} = require("./Configs/db");
const {userRoute} = require("./Routes/user.routes");
const {auth} = require("./Middlewares/auth");
const redisURL = process.env.redisURL;
const {weatherRoute} = require("./Routes/weather.routes");

const client = createClient();

client.on('error', err => console.log('Redis Client Error', err));

const app = express();

app.use(express.json());
app.use("/user",userRoute);
app.use("/weather",weatherRoute);

app.get("/",(req,res) => {
    res.send("hello");
})

app.listen(port, async () => {
    try{
        await connection;
        await client.connect();
        console.log("Connected to Database");
    }
    catch(err){
        console.log(err.message);
    }
    console.log(`Server is running at port ${port}`);
})

// module.exports = {client};