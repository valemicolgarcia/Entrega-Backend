import passport from "passport";
import jwt from "passport-jwt";
import GithubStrategy from "passport-github2";
import GoogleStrategy from "passport-google-oauth20";
import UserModel from "../models/user.model.js";
import CartManager from "../manager/cart-manager.js";
const manager = new CartManager();


const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["coderCookieToken"];
    }
    return token;
};

const initializePassport = () => {
    // Estrategia JWT (current)
    passport.use("current", new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: "coderhouse"
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload);
        } catch (error) {
            return done(error);
        }
    }));

    // Serialización y deserialización para las sesiones
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await UserModel.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });

    // Estrategia GitHub
    passport.use("github", new GithubStrategy({
        clientID: "Iv23li0VyEFTNFy9orif",
        clientSecret: "6313f9a73b5d83f3b7094e96c1c53d20c89cd719",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        console.log("perfil", profile);
        try {
            let user = await UserModel.findOne({ email: profile._json.email });
            if (!user) {
                const nuevoCarrito = await manager.crearCarrito();
                let newUser = {
                    first_name: profile._json.name || profile.username, // Usa el nombre o username si name no está disponible
                    last_name: "N/A",       // Valor por defecto para el apellido
                    age: 0,                 // Valor por defecto para la edad
                    email: profile._json.email,
                    password: "oauth",      // Valor predeterminado ya que se autentica vía GitHub
                    cart: nuevoCarrito._id   // Asigna el carrito creado
                };
                let result = await UserModel.create(newUser);
                done(null, result);
            } else {
                if (!user.cart) {
                    const nuevoCarrito = await manager.crearCarrito();
                    user.cart = nuevoCarrito._id;
                    await user.save();
                }
                return done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }));

    // Estrategia Google
    passport.use("google", new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        //  callbackURL: "http://localhost:8080/auth/google"
        callbackURL: "http://localhost:8080/api/sessions/googlecallback"
    }, async (accessToken, refreshToken, profile, done) => {
        console.log("Google profile", profile);
        try {
            // Usamos profile.emails[0].value y profile.displayName
            let user = await UserModel.findOne({ email: profile.emails[0].value });
            if (!user) {
                const nuevoCarrito = await manager.crearCarrito();
                let newUser = {
                    first_name: profile.displayName,
                    last_name: "N/A",       // Valor predeterminado para last_name
                    age: 0,
                    email: profile.emails[0].value,
                    password: "oauth",      // Valor predeterminado para password (ya que se autentica vía Google)
                    cart: nuevoCarrito._id   // Asigna el carrito creado
                };
                let result = await UserModel.create(newUser);
                done(null, result);
            } else {
                if (!user.cart) {
                    const nuevoCarrito = await manager.crearCarrito();
                    user.cart = nuevoCarrito._id;
                    await user.save();
                }
                return done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }));
};

export default initializePassport;
