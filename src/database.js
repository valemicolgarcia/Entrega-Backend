import mongoose from "mongoose"; //mongoose es una biblioteca que facilita la interaccion con mongoDB desde node.js

//me conecto a mi instancia de mongodb Atlas, recibiendo el URI de conexion

mongoose.connect("mongodb+srv://valemicolgarcia:coderhouse@cluster0.rslwa.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("conectados a la base de datos con exito"))
    .catch((error) => console.log("TENEMOS UN ERROR: " + error)
    );

//.