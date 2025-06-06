require("dotenv").config()
const express = require("express")


const app = express()
app.use(express.static('build'))

app.use(express.json())
const Person = require("./models/person")

//Get the people from the database
app.get("/api/persons", (request, response) =>{
    Person.find({}).then(persons=>{
        response.json(persons)
    })
})

//Add a new person to the database
app.post("/api/persons", async (req, res, next)=>{

    const {name, number} = req.body

    //if number or name is missing
    if(!number || !name){
        return res.status(400).json({
            error: "number or name missing"
        })
    }

    //Check if the user exists in the database:
    const existingPerson = await Person.findOne({name: name})

    //if the person exists
    if(existingPerson){
        //Update number
        existingPerson.number = number
        const updated = await existingPerson.save()
        return res.json(updated)
    }
        
    //A new person is being added
    else{
        //Create the new person in the phonebook
        const newPerson = new Person({
            name: name,
            number: number
         })

        newPerson.save().then(savedPerson =>{
            res.json(savedPerson)
        })
        .catch(error => next(error))
    }

})

//Get an individual person
app.get("/api/persons/:id", (req, res, next)=>{
    Person.findById(req.params.id)
        .then(person=>{
            if(person){
                res.json(person)
            }else{
                res.status(404).end()
            }
         })
            .catch(error => next(error))
})

app.delete("/api/persons/:id", (req, res, next) =>{
    Person.findByIdAndDelete(req.params.id)
        .then(result =>{
            res.status(204).end()
        })
        .catch(error => next(error))
})

app.put("/api/persons/:id", (req, res, next) =>{
    const {name, number} = req.body

    Person.findById(req.params.id)
        .then(person =>{
            if(!person){
                return res.status(404).end()
            }

            person.name = name
            person.number = number

            return person.save().then((updatedPerson) =>{
                res.json(updatedPerson)
            })
        })
        .catch(error => next(error))
})


const unknownEndpoint = (req, res) =>{
    res.status(404).send({error: "unknown endpoint"})
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next)=>{
    console.error(error.message)

    if(error.name === "CastError"){
        return res.status(400).send({error: "malformatted id"})
    }
    else if (error.name === "ValidationError") {
        return res.status(400).json({error: error.message})
    }
    next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})