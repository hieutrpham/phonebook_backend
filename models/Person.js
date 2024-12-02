import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config({path: '../.env', debug:true})

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url);

mongoose.connect(url)
    .then(result => {console.log('connected to MongoDB');
    })
    .catch(err => {
        console.log('error connecting to db', err.message);  
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

export default personSchema