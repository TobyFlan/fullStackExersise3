const express = require('express')
const cors = require('cors')
const app = express()
var morgan = require('morgan')

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
    response.json(persons)
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

    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);

    if(!person){
        return response.status(404).json({
            error: `content missing`
        });
    }

    response.json(person);

})

//delete a person from the phonebook
app.delete('/api/persons/:id', (request, response) => {

    const id = Number(request.params.id);
    
    persons = persons.filter(p => p.id !== id)

    response.status(204).end()

})


//generate random new id. Random range is big enough so there
//should not be any collsisions
const generateId = () => {
    return Math.floor(Math.random() * (10000 + 1))
}



//add a new person to the phonebook.
app.post('/api/persons', (request, response) => {

    const body = request.body

    //sanity check on input data
    if(!body.number || !body.name){
        return response.status(400).json({
            error: "number or name missing"
        })
    }

    //check if name already in phonebook    
    const names = persons.map(p => p.name.toLowerCase());
    if(names.includes(body.name.toLowerCase())){
        return response.status(204).json({
            error: "name must be unique"
        })
    }
    

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(person);

    console.log(`added new person at index: ${person.id}`);
    
    response.json(person);

})




const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);    
})


