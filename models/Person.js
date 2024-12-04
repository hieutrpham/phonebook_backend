import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config({path: '../.env', debug:true})

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url);

mongoose.connect(url)
    .then(() => {console.log('connected to MongoDB');
    })
    .catch(err => {
        console.log('error connecting to db', err.message);  
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: [true, 'Name is required']
    },
    number: {
        type: String,
        minLength: 8,
        validate: {
            validator: (v) => {return /\d{3}-\d{3}-\d{4}/.test(v)}
        },
        message : props => `${props.value} is not a valid phone number`,
        required: [true, 'Phone number required']
    },
})

export default personSchema