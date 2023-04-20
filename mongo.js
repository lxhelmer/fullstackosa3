const mongoose = require('mongoose')

const passwd = process.argv[2]

const url =
	`mongodb+srv://helmer:${passwd}@cluster0.nmpwla9.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length<5) {
	console.log('phonebook:')
	Person.find({}).then(result => {
		result.forEach(person => {
			console.log(person.name, person.number)
		})
		mongoose.connection.close()
	})
} else {
	const name =  process.argv[3]
	const number = process.argv[4]

	const person = new Person ({
		name: `${name}`,
		number: `${number}`,
	})

	person.save().then(result => {
		console.log(`added ${name} number ${number} to phonebook`)
		mongoose.connection.close()
	})
}
