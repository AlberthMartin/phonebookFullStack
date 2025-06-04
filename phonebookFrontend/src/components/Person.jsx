export const Person = ({personName, personNumber, deletePerson}) => {
    return(
      
      <li>{personName} {personNumber} <button onClick={deletePerson}>Delete</button></li>
    )
  }
  