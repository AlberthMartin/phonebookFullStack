const express = require("express")

const morgan = require("morgan")


morgan.token('body', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : '';
  });

const app = express()

const cors = require('cors')

app.use(cors({
    origin: 'https://phonebookfullstack-qcwt.onrender.com/'
  }));

app.use(express.static('dist'))

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [
    { 
        "id": "1",
        "name": "Arto Hellas", 
        "number": "040-123456"
      },
      { 
        "id": "2",
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
      },
      { 
        "id": "3",
        "name": "Dan Abramov", 
        "number": "12-43-234345"
      },
      { 
        "id": "4",
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
      }
]



app.get("/api/persons", (request, response) =>{
    response.json(persons)
})

app.get("/info", (req, res)=>{
    res.send(`
        <p>Phonebook has info for ${persons.length} people </p>
        <p>${Date()}</p>
        `)
})

app.get("/api/persons/:id", (req, res) =>{
    const id = req.params.id
    const person = persons.find(person => person.id === id)

    if(person){
        res.json(person)
    }else{
        res.status(404).end()
    }
})

app.delete("/api/persons/:id", (req,res)=>{
    const id = req.params.id
    persons = persons.filter(pers => pers.id !== id)

    res.status(204).end()
})


app.post("/api/persons", (req, res)=>{
    const body = req.body

    //if number or name is missing
    if(!body.number || !body.name){
        return res.status(400).json({
            error: "number or name missing"
        })
    }
    //if name already exists in the data
    if(persons.find(pers => pers.name === body.name)){
        return res.status(400).json({
            error: "name must be unique"
        })
    }
    
    //Create the new person in the phonebook
    const person = {
        //random number between 10-444
        id: String(Math.floor(Math.random()*(444-10+1)+10)),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    
    res.json(person)


})

const generateId = () => {
    const maxId = notes.length > 0 
    ? Math.max(...notes.map(n=>Number(n.id)))
    : 0
    return String(maxId+1)
}


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})