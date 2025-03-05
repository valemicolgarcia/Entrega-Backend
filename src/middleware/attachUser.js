// attachUser.js
import jwt from 'jsonwebtoken';

export const attachUser = (req, res, next) => {
    const token = req.cookies?.coderCookieToken;
    if (token) {
        try {
            // Usa la misma secret que en passport.config.js (o de process.env)
            const user = jwt.verify(token, process.env.JWT_SECRET || 'coderhouse');
            req.user = user;
        } catch (error) {
            // Si el token es inválido o expiró, simplemente no asignamos req.user
            console.error("Token inválido", error);
        }
    }
    next();
};
