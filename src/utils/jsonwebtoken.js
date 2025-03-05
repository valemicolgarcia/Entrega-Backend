import jwt from "jsonwebtoken";

const private_key = "coderhouse";

export const generateToken = (user) => {
    const token = jwt.sign(user, private_key, { expiresIn: '24h' });
    //en el objeto de configuraicon le puedo colocar una fecha de expiracion 
    return token;
}