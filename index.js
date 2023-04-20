const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))


morgan.token('body', function (req,res) {return JSON.stringify(req.body)})

app.use(morgan(function (tokens, req, res) {
	if (tokens.method(req,res) == "POST") {
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

let persons = [
	{
		id:1,
		name: "Arto Hellas",
		number: "555-123456"
	},
	{
		id:2,
		name: "Ada Lovelace",
		number: "39-44-5323523"
	},
	{
		id:3,
		name: "Dan Abramov",
		number: "12-443-234345"
	},
	{
		id:4,
		name: "Mary Poppendick",
		number: "39-23-6423122"
	}
]

app.get('/api/persons', (reg,res) => {
	res.json(persons)
})

app.get('/info', (reg,res) => {
	res.send(`<p>Phonebook has info for ${persons.length} people</p>
						<p>${Date()}</p>`
	)
})

app.get('/api/persons/:id', (req,res) => {
	const id = Number(req.params.id)
	const p = persons.find(p => p.id === id)
	if (p) {
		res.json(p)
	} else {
		res.status(404).end()
	}
})

app.delete('/api/persons/:id', (req,res) => {
	const id = Number(req.params.id)
	persons = persons.filter(p => p.id !== id)
	res.status(204).end()
})

app.post('/api/persons', (req,res) => {

	const body = req.body

	if (!body.name || !body.number) {
		return res.status(400).json({
			error: 'name or number missing'
		})
	} else if (persons.find(p => p.name === body.name)) {
		return res.status(400).json({
			error: 'name must be unique'
		})
	} else {
		person = {
			name: body.name,
			number: body.number,
			id: Math.floor(Math.random()*1000000),
		}
		persons = persons.concat(person)
		res.json(body)
	}
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
