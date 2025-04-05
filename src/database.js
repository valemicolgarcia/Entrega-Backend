import mongoose from "mongoose"; //mongoose es una biblioteca que facilita la interaccion con mongoDB desde node.js

//me conecto a mi instancia de mongodb Atlas, recibiendo el URI de conexion
import dotenv from "dotenv";
dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("conectados a la base de datos con exito"))
  .catch((error) => console.log("TENEMOS UN ERROR: " + error));

//.
