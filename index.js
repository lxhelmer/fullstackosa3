require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

const Person = require('./models/person')




morgan.token('body', function (req) {return JSON.stringify(req.body)})

app.use(morgan(function (tokens, req, res) {
	if (tokens.method(req,res) === 'POST') {
		return [
			tokens.method(req, res),
			tokens.url(req, res),
			tokens.status(req, res),
			tokens.res(req, res, 'content-length'), '-',
			tokens['response-time'](req, res), 'ms',
			tokens.body(req,res)
		].join(' ')
	} else {
		return [
			tokens.method(req, res),
			tokens.url(req, res),
			tokens.status(req, res),
			tokens.res(req, res, 'content-length'), '-',
			tokens['response-time'](req, res), 'ms'
		].join(' ')
	}
}))


app.get('/api/persons', (reg,res) => {
	Person.find({}).then(persons => {
		res.json(persons)
	})
})

app.get('/info', (reg,res) => {
	Person.find({}).then(result => {
		res.send(`<p>Phonebook has info for ${result.length} people</p>
							<p>${Date()}</p>`
		)
	})
})

app.get('/api/persons/:id', (req,res,next) => {
	Person.findById(req.params.id)
		.then(p => {
			if (p) {
				res.json(p)
			} else {
				res.status(404).end()
			}
		})
		.catch(error => next(error))
})

app.delete('/api/persons/:id', (req,res,next) => {
	Person.findByIdAndRemove(req.params.id)
		.then(() => {
			res.status(204).end()
		})
		.catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {

	const { number } = req.body

	Person.findByIdAndUpdate(req.params.id, { number:`${number}` },{ new: true })
		.then(result => {
			res.json(result)
		})
		.catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {

	const body = req.body
	if (!body.name || !body.number) {
		return res.status(400).json({
			error: 'name or number missing'
		})
	} else {
		const person = new Person({
			name: body.name,
			number: body.number,
		})

		person.save().then(savedPerson => {
			res.json(savedPerson)
		})
			.catch(error => next(error))
	}
})

const errorHandler = (error, request, response, next) => {
	console.error(error.message)

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message })
	}
	next (error)
}


app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
