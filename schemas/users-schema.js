const { verify } = require('jsonwebtoken');
const mongoose = require('mongoose');

const Schema =mongoose.Schema;

const userschema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cart: [
        {
            prodId:{type:String ,require:true},
            qnty:{type:Number ,require:true}
        }
    ],
    isverify:{
        type:Boolean,
        required: true
    },
    Vcode:{
        type:String,
        
    }

})

module.exports = mongoose.model("users", userschema);