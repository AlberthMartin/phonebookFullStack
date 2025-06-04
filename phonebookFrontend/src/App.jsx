import { useState, useEffect } from 'react'
import axios from 'axios'
import { Person } from './components/Person'
import personService from "./services/persons"

const AddFilter = ({renderFilteredPeople, newFilter, handleFilterChange}) =>{
  return(
    <div>
      <h2>Phonebook</h2>
        <form onSubmit={renderFilteredPeople} id="searchForm">
      <div>
        Add filter: 
        <input
        value={newFilter}
        onChange={handleFilterChange}
        />
      </div>
      <div>
        <button type="submit">search</button>
      </div>
      </form>
    </div>
    )
}

const Filter = ({filteredPeople}) =>{
  return(
  filteredPeople.map((pers)=>(
    <p key={`key${pers.name}`}> {pers.name} {pers.number}</p>
  ))
)
}

const PersonForm = ({addPerson, newName, newNumber, handleNumberChange, handleNameChange}) =>{
  return(
  <div>
  <h2>Add new person</h2>
      <form onSubmit={addPerson} id="addPersonForm">
        <div>
          name: <input 
          value={newName}
          onChange={handleNameChange}
          />
          number: <input
          value={newNumber}
          onChange={(handleNumberChange)}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
    )
}

const Persons = ({persons,deletePerson, errorMessage}) =>{
  return(
    <div>
      <h2>Numbers</h2>
      <ul>
        {persons.map((pers)=>(
          <Person key={pers.id} 
          personName={pers.name} 
          personNumber={pers.number} 
          deletePerson={()=> deletePerson(pers.id)}/>
        ))}
      </ul>
    </div>
)
}

const Notification = ({message, messageType}) =>{
  if(message === null) {
    return null
  }

  return(
    <div className={messageType}>
      {message}
    </div>
  )
}


const App = () => {
  //Initially stored people
  const [persons, setPersons] = useState([]) 
  const [filteredPeople, setFilteredPeople] = useState([])

  //Meant for controlling the from input element
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setFilter] = useState('')

  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)

  useEffect(() => {
    personService
    .getAll()
    .then(response =>{
      setPersons(response.data)
    })
    
  }, [])
  console.log("render", persons.length, "persons");

  const addPerson = (event) =>{
    event.preventDefault()

    //remove spaces from start and end
    const cleanedName = newName.toLowerCase().trim();
    const cleanedNumber = newNumber.replace(/\s+/g, '');

    const existingPerson = persons.find(pers => pers.name.toLowerCase().trim() === cleanedName)

    console.log("checking for:", cleanedName)

    //Check if the name already exists
    if(existingPerson){    
      const result = window.confirm(`${cleanedName} already exists. Do you want to update the number?`)

      //Want to update number?
      if(result){
        const updatedPerson = {...existingPerson, number: cleanedNumber}

        //Update number
        personService
        .update(existingPerson.id, updatedPerson)
        .then((response)=>{
          setPersons(
            persons.map(pers => pers.id === existingPerson.id ? response.data : pers))
          }).catch(error =>{
            setMessageType("error")
            setMessage(
              `Information of ${existingPerson.name} has already been removed from server`
            )
            setTimeout(()=>{
              setMessage(null)
              setMessageType(null);
            },5000)
          })
      }
      //Updated or kept number
      return;
    }


    //Creates a new object
    const personObject = {
      name: cleanedName,
      number: cleanedNumber,
    }
  
    personService
    .create(personObject)
    .then(response =>{
      setPersons(persons.concat(response.data))
    })
    
    setMessageType("info");

    setMessage(
      `Added: ${personObject.name}`
    )
    setTimeout(()=>{
      setMessage(null)
      setMessageType(null)
    }, 5000)

    //Clear input fealds
    setNewName("")
    setNewNumber("")
  }
  //delete och add borde flyttas till persons
  const deletePerson = (id) => {

    const result = window.confirm(`Are you sure you want to delete this person`)

    if(result){
      personService.deletePerson(id).then(() =>{
        //Update the state by removing the deleted person
        setPersons(persons.filter(pers => pers.id !== id))
      })
  }
}

  const renderFilteredPeople = (event) =>{
    console.log("rendering filtered names")
    event.preventDefault()

    //Sets the new filtered people to the people who satisfy the followig condition:
    //
  
    setFilteredPeople(
      persons.filter(pers =>
         pers.name.toLowerCase().includes(newFilter.toLowerCase())))
  
    setFilter("")
  }
  
  const handleFilterChange = (event) =>{
    setFilter(event.target.value)
  }

  const handleNameChange = (event) =>{
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) =>{
    setNewNumber(event.target.value)
  }


  return (
    <div>
      <Notification message={message} messageType={messageType}/>

      <AddFilter 
      renderFilteredPeople={renderFilteredPeople} 
      newFilter={newFilter} 
      handleFilterChange={handleFilterChange}/>
    
      <Filter filteredPeople={filteredPeople}/>

      <PersonForm 
      addPerson={addPerson} 
      newName={newName} 
      newNumber={newNumber} 
      handleNameChange={handleNameChange} 
      handleNumberChange={handleNumberChange}/>
      
      <Persons persons={persons} deletePerson={deletePerson}/>
      </div>
  )
}

export default App