require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
var morgan = require('morgan')

const Person = require('./models/person')

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())



morgan.token('new-person', (req, res) => {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] :response-time ms :new-person'))


//return all people saved to the server
app.get(`/api/persons`, (request, response) => {
    Person.find({}).then(people => {
        response.json(people);
    })
})


//return info about the server
app.get(`/info`, (request, response) => {

    let date = new Date()

    Person.count({}).then(result => {
        response.send(`
        <div>
            <p>Phonebook has info on ${result} people</p>
            ${date}
        </div>
    `)
    })


})

const errorHandler = (error, request, response, next) => {
    console.log(error.message);

    if(error.name === 'CastError') {
        return response.status(400).send({ error: "malformed id"});
    }

    next(error);
    
}

app.use(errorHandler)
    
//return info about a specific person in the phonebook
app.get(`/api/persons/:id`, (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        response.json(person);
    }).catch(error => next(error))
})

//delete a person from the phonebook
app.delete('/api/persons/:id', (request, response, next) => {

    Person.findByIdAndDelete(request.params.id).then(result => {
        response.status(204).end()
    }).catch(error => next(error))
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

//update a persons entry into the phonebook
app.put('/api/persons/:id', (request, response, next) => {

    const body = request.body;

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, {new: true})
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);    
})


