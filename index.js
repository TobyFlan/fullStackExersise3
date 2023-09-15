require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
var morgan = require('morgan')

const Person = require('./models/person')

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))


morgan.token('new-person', (req, res) => {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] :response-time ms :new-person'))

let persons = [
    { 
    id: 1,
    name: "Arto Hellas", 
    number: "040-123456"
    },
    { 
    id: 2,
    name: "Ada Lovelace", 
    number: "39-44-5323523"
    },
    { 
    id: 3,
    name: "Dan Abramov", 
    number: "12-43-234345"
    },
    { 
    id: 4,
    name: "Mary Poppendieck", 
    number: "39-23-6423122"
    }
]

//return all people saved to the server
app.get(`/api/persons`, (request, response) => {
    Person.find({}).then(people => {
        response.json(people);
    })
})


//return info about the server
app.get(`/info`, (request, response) => {

    let date = new Date()

    response.send(`
        <div>
            <p>Phonebook has info on ${persons.length} people</p>
            ${date}
        </div>
    `)
})
    
//return info about a specific person in the phonebook
app.get(`/api/persons/:id`, (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person);
    })
})

//delete a person from the phonebook
app.delete('/api/persons/:id', (request, response) => {

    const id = Number(request.params.id);
    
    persons = persons.filter(p => p.id !== id)

    response.status(204).end()

})

//add a new person to the phonebook database
app.post('/api/persons', async (request, response) => {

    const body = request.body

    //sanity check on input data
    if(!body.number || !body.name){
        return response.status(400).json({
            error: "number or name missing"
        })
    }

    //check if name already in phonebook    
    const existingPerson = await Person.findOne({ name: body.name });

    if (existingPerson) {
        return response.status(204).json({
            error: "name must be unique"
        });
    }
    
    console.log('adding new person now');
    

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        console.log('added new person to DB');
        response.json(savedPerson)
    })

})

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);    
})


