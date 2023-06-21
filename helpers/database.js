const mongoose = require("mongoose")


const Connectdb = () => {
    mongoose.connect("mongodb+srv://vscode:aditya1200@cluster0.rntqk8l.mongodb.net/?retryWrites=true&w=majority").then((data) => { console.log("Db connected") })
}


module.exports = Connectdb