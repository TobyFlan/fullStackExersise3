const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give a password as an argument');
    process.exit(1);    
}

const password = process.argv[2]

const uri = `mongodb+srv://TobyFlan:${password}@fullstackcourse.6v0isla.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false);
mongoose.connect(uri)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema);

if(process.argv.length >= 5){

    const person = new Person({
        name:String(process.argv[3]),
        number:String(process.argv[4]),
    })

    person.save().then(result => {
        console.log('note saved!');
        mongoose.connection.close()
    })

} else {

    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person);
        })
        mongoose.connection.close()
    })
}