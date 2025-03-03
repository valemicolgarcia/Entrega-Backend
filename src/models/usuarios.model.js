import mongoose from "mongoose";
const usuarioSchema = new mongoose.Schema({
    usuario: String,
    password: String,
    cart: String, //aca se puede poner el populate
    rol: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    }
})

const UsuarioModel = mongoose.model("usuarios", usuarioSchema);
export default UsuarioModel;

