const mongoose = require('mongoose');
const schema = new mongoose.Schema
({
    email:{
        type: String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    phone:{
        type: String,
        required: true
    },
    address:{
        type:String,
        required:true
    },
    cart: [
        {
            prodId:{type:String ,require:true},
            qnty:{type:Number ,require:true}
        }
    ],
})

module.exports = mongoose.model("checkout", schema);