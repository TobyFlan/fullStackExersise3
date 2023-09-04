const express = require('express')
const app = express()

app.use(express.json())

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




const PORT = 3001;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);    
})

