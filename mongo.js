/*
 * mongosh "mongodb+srv://cluster0.dkwjc.mongodb.net/myFirstDatabase" --username fullstack_2020
 */
const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
const dbName = "connect-four"

const url = `mongodb+srv://fullstack_2020:${password}@cluster0.dkwjc.mongodb.net/${dbName}?retryWrites=true&w=majority`

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
    content: 'HTML is Easy',
    date: new Date(),
    important: true
})

note.save().then(result => {
    console.log('note saved')
    mongoose.connection.close()
})