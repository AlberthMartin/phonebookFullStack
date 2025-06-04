//Service for managing the database of people in the app
import axios from "axios";
const baseUrl = import.meta.env.VITE_API_URL;

fetch(`${baseUrl}/api/persons`)
  .then(res => res.json())
  .then(data => console.log(data));

const getAll = () =>{
    return axios.get(baseUrl)
}

const create = newPerson =>{
    return axios.post(baseUrl, newPerson)
}

const update = (id, updatedPerson)=>{
    return axios.put(`${baseUrl}/${id}`, updatedPerson)
}

const deletePerson = id =>{
    return axios.delete(`${baseUrl}/${id}`);
}

export default { getAll, create, update, deletePerson };
