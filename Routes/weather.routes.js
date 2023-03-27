const express = require("express");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const {auth} = require("../Middlewares/auth");
const apikey = process.env.weatherAPIKey;
const redis = require("redis");
const {client} = require("../index");

const weatherRoute = express.Router();

//user gets weather update of his/her hometown city, which they entered while registering
weatherRoute.get("/",auth,async (req,res) => {
    const userCity = req.user.city;
    try{
        const cityResponse = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${userCity}&limit=5&appid=${apikey}`)
        .then((res) => {
            return res.json();
        })
        .then(async (data) => {
            const lat = data[0].lat;
            const lon = data[0].lon;
            const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}`)
            .then((res) => {
                return res.json();
            })
            .then(async (data) => {
                // const cityWeather = JSON.stringify(data);
                // await client.set(`${city}`,`${cityWeather}`);
                res.send(data);
            })
        })
    }
    catch(err){
        res.send({"message":"Something went wrong","error":err.message});
    }
})


//send query as ?city="delhi"
weatherRoute.get("/city/",async (req,res) => {
    const {city} = req.query;
    try{
        const cityResponse = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apikey}`)
        .then((res) => {
            return res.json();
        })
        .then(async (data) => {
            const lat = data[0].lat;
            const lon = data[0].lon;
            const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}`)
            .then((res) => {
                return res.json();
            })
            .then(async (data) => {
                // const cityWeather = JSON.stringify(data);
                // await client.set(`${city}`,`${cityWeather}`);
                res.send(data);
            })
        })
    }
    catch(err){
        res.send({"message":"Something went wrong","error":err.message});
    }
})

module.exports = {weatherRoute};