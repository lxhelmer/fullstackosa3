const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)
	.then(() => {
		console.log('connected')
	})
	.catch((error) => {
		console.log('error', error.message)
	})

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minlength: 3,
	},
	number: {
		type: String,
		minlength: 9,
		validate: {
			validator : function(v) {
				return /^\d{2,3}-\d*$/.test(v)
			},
			message: 'The form must be xx-xxxxxx... or xxx-xxxxx...',
		},
	}
})

personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model('Person', personSchema)

