const express = require('express');
let persons = require('./data');
const app = express();
let morgan = require('morgan');

app.use(express.json());

// const requestLogger = (request, response, next) => {
//   console.log('Method:', request.method);
//   console.log('Path:', request.path);
//   console.log('Body:', request.body);
//   console.log('---');
//   next();
// }

app.use(morgan((tokens, req, res) =>{
  return ([
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' '))
}))
// app.use(requestLogger);

const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return maxId + 1
  }

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  
app.get('/api/persons', (request, response) => {
response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
const id = Number(request.params.id)
const person = persons.find(person => person.id === id)
if (person) {
    response.json(person);
} else {
    response.status(404).end()
}
})

app.get('/info', (request, response) => {
    const date = new Date();
    const info = `<p>Phonebook has info for ${persons.length} people</p> \n ${date}`;
    response.send(info);
    })
    
app.post('/api/persons', (request, response) => {
const body = request.body
    if (!body.name) {
        return response.status(400).json({ 
        error: 'name missing' 
        })
    }

    if (!body.number) {
        return response.status(400).json({ 
        error: 'number missing' 
        })
    }
    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(person)
    response.json(person)
}) 

app.delete('/api/persons/:id', (request, response) => {
const id = Number(request.params.id)
console.log('delete ', id);
persons = persons.filter(person => person.id !== id)

response.status(204).end()
})

// const unknownEndpoint = (request, response) => {
//   response.status(404).send({ error: 'unknown endpoint '});
// }
// app.use(unknownEndpoint);

const PORT = 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})