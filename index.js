import express, { json, response } from 'express'
import morgan from 'morgan'

const app = express()

app.use(express.json())

morgan.token('data', function getData(req) { 
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :response-time :data'))

let entries = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/entries', (request, response) => {
    response.json(entries)
})

app.get('/info', (request, response) => {
    response.send(
        `Phonebook has info for ${entries.length} people
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
    else if (entries.find(p => p.name === body.name)) {
        return response.status(400).json({error: "name must be unique"})
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }
    
    entries = entries.concat(person)

    response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})