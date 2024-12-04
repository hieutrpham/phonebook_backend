import 'dotenv/config'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import mongoose from 'mongoose'
import personSchema from './models/Person.js'

const app = express()

app.use(express.json())

app.use(cors())

app.use(express.static('dist'))

morgan.token('data', function getData(req) { 
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :response-time :data'))

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
    else if (error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
    }
    next(error)
  }
  

const Person = mongoose.model('Person', personSchema)

app.get('/api/entries', (request, response) => {
    Person.find({}).then(person => {response.json(person)})
        .catch(err => next(err))
})

app.get('/info', (request, response, next) => {
    Person.countDocuments({})
        .then(count => {
            response.send(`
                <p>Phonebook has info for ${count} people</p>
                <p>${Date()}</p>
                `)
        })
        .catch(err => next(err))
})

app.get('/api/entries/:id', (request, response, next) => {
    const id = request.params.id
    console.log(id);
    
    Person.findById(id).then(person => {
        if (person) {response.json(person)}
        else {response.status(404).end()}
    })
    .catch(err => next(err))

})

app.delete('/api/entries/:id', (request,response,next)=>{
    Person.findByIdAndDelete(request.params.id)
        .then(() => response.status(204).end())
        .catch(err => next(err))
})


app.post('/api/entries', (request,response,next)=>{
    const body = request.body

    const person = new Person ({
        name: body.name,
        number: body.number
    })

    person.save().then(result => {
        console.log('person saved', result);
        response.json(person)
    })
        .catch(err => next(err))
})

app.put('/api/entries/:id', (request, response) => {
    
    const body = request.body
    const id = request.params.id

    console.log(id);
    

    const person = {
        name: body.name,
        number: body.number
    }
        
    Person.findByIdAndUpdate(request.params.id, person, {new:true})
        .then(newPerson => {
            console.log(newPerson);
            
            return response.json(newPerson)})
        .catch(err => next(err))
})


app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})