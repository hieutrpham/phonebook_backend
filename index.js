import 'dotenv/config'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import mongoose from 'mongoose'
import personSchema from './models/Person.js'

const Person = mongoose.model('Person', personSchema)

const app = express()

app.use(express.json())

app.use(cors())

app.use(express.static('dist'))

morgan.token('data', function getData(req) { 
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :response-time :data'))

app.get('/api/entries', (request, response) => {
    Person.find({}).then(person => response.json(person))
})

app.get('/info', (request, response) => {
    response.send(
        `Phonebook has info for ${Person.length} people
        <p>
        ${Date()}
        </p>
        `
    )
})

app.get('/api/entries/:id', (request,response)=>{
    const id = request.params.id
    const person = entries.find(entry=>entry.id===id)
    if (person) {
        response.json(person)
    }
    else {response.status(404).end()}
})

app.delete('/api/entries/:id', (request,response)=>{
    const id = request.params.id
    entries = entries.filter(person => person.id !== id)
    response.status(204).end()
})

const generateId = () => {
    return Math.floor(Math.random()*(99999999))
}

app.post('/api/entries', (request,response)=>{
    const body = request.body
    
    console.log(!body, !body.name, !body.number);

    console.log(!body || !body.name || !body.number);
    

    if (!body) {
        return response.status(400).json({error: "content missing"})
    }
    else if (!body.name) {
        return response.status(400).json({error: "name missing"})
    }
    else if (!body.number) {
        return response.status(400).json({error: "number missing"})
    }
    // else if (entries.find(p => p.name === body.name)) {
    //     return response.status(400).json({error: "name must be unique"})
    // }

    const person = new Person ({
        name: body.name,
        number: body.number
    })

    person.save().then(result => {
        console.log('person saved', result);
        response.json(person)
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})