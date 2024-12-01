import mongoose from "mongoose";

const password = process.argv[2]

const dbName = 'phonebook'

const url = `mongodb+srv://hieutrungpham91:${password}@fullstack.rmyg1.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=fullstack`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: Number,
})

const Person = mongoose.model('Person', phonebookSchema)


if (process.argv.length == 5) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })

    person.save().then(r => {
        console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`);
        mongoose.connection.close()
    })
}
else if (process.argv.length == 3) {
    Person.find({})
        .then(console.log("phonebook:"))
        .then(result => {
            result.forEach(person => {console.log(person.name, person.number)})
            mongoose.connection.close()
        })
    
}