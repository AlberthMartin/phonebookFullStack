
//MongoDB
const mongoose = require("mongoose")

mongoose.set("strictQuery", false)
  
const url = process.env.MONGODB_URI
console.log("Connecting to", url)
  
mongoose.connect(url)
    .then(result =>{
        console.log("connected to MongoDB")
    })
    .catch(error=>{
        console.log("error connection to MongoDB", error.message)
    })


//Create the database schema
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: [3, "Name must be 3 or more characters"],
        required: [true, "Name is required"]
    },
    number: {
        type: String,
        minlength: [8, "Number must be at least 8 characters"],
        validate: {
            validator: function(v){
                return /^\d{2,3}-\d+$/.test(v)
            },
            message: props => `${props.value} is not a valid phone number, Format should be 040-1915419`       
         },
         required: [true, "Number is required"]
    }
})


//Delete the __v flag
personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
      }
    })

module.exports = mongoose.model("Person", personSchema)