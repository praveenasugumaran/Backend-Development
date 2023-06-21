require('dotenv').config()
const express=require('express');
const bodyParser=require('body-parser');
const app=express()
const https=require('https')
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html")
});
app.post("/",function(req,res){
    const location=req.body.location;
    const apikey=process.env.API_KEY
    const url="https://maps.googleapis.com/maps/api/geocode/json?address="+location+"&key="+apikey;
    https.get(url,function(response){
        response.on("data",function(data){
            try{
                const locData=JSON.parse(data);
                return res.status(200).json({locData})
            }
            catch(error){
                return res.status(400).json({message:'An error event occurred'});
            }
            
            
        })
    })

})
app.listen(1234,function(req,res){
    console.log("successfully connected to the port 1234....")
}); 