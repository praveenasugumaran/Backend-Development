const express=require('express');
const bodyParser=require('body-parser')
const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const cookieParser=require('cookie-parser')
const { createToken } =require('./JWT');
const app=express();
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json())
app.use(cookieParser())
mongoose.connect("mongodb://127.0.0.1:27017/broadway")
const usersSchema={
    username:String,
    email:String,
    password:String
}
const users=mongoose.model("users",usersSchema)

app.get("/",function(req,res){
    res.sendFile(__dirname+"/login.html")
})
app.post("/",async function(req,res){
    const email=req.body.email;
    const password=req.body.password;
    try{
        const userExists=await users.findOne({email})
        const isPasswordMatch = await bcrypt.compare(password, userExists.password);

        if(userExists){
            if(isPasswordMatch){
                const accessToken=createToken(userExists);
                res.cookie("access-token",accessToken,{
                    maxAge:60*60*24*30*1000,
                    httpOnly:true,
                });
                console.log(accessToken)
                return res.status(200).json({message:'user successfully logged in'});
            }
            else{
                return res.status(400).json({message:'invalid password'})
            }

        }
        else{
            return res.status(400).json({message:'user doesnt exists'})
        }
    }
    catch(error){
        return res.status(500).json({message:'An error occurred'})
    }
})

app.get("/signup",function(req,res){
    res.sendFile(__dirname+"/signup.html")
})
app.post("/signup",async function(req,res){
    const username=req.body.username;
    const email=req.body.emailid;
    const TextPassword=req.body.password;
    const hashedPassword=await bcrypt.hash(TextPassword,10)
    try{
        const existingUser=await users.findOne({email});
        if(existingUser){
            return res.status(400).json({message:'user already exists'});
        }
        else{
            const newUser=new users({
                username:username,
                email:email,
                password:hashedPassword
            });
            await newUser.save();
            return res.status(200).json({message:'user saved successfully'})
        }
    }
    catch(error){
        console.error(error);
        return res.status(500).json({message:'An error occurred'});
    }
   

})
app.listen(3000,function(req,res){
    console.log("successfully listening to port 3000....")
})
//map api key : AIzaSyDOtqbkt7T3XhUtM-ABH8Hx9xj9aPOn9E8
//map api reference: https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY