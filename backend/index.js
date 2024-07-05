import express from "express"

const app=express();

app.get("/",(req,res)=>{
    res.json("Hello People");
})

app.listen(8080,(req,res)=>{
    console.log("Listening on port 8080");
})