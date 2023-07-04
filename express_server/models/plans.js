const mongoose=require('mongoose');
const companyPlansSchema=new mongoose.Schema({
    amount:{
        type:Number,
        required:true
    },
    name:{
       type:String,
       required:true 
    },
    expireDate:{
        type:Number,
        required:true
    }
})

const plans=mongoose.model("Plans",companyPlansSchema);

module.exports = plans;