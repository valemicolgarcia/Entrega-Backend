import passport from "passport";
import jwt from "passport-jwt";

const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

const initializePassport = () => {
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

}

const cookieExtractor = (req) => {
    let token = null;

    if (req && req.cookies) {
        token = req.cookies["coderCookieToken"];
    }

    return token;
}

//agrego la autenticacion con GITHUB
import GithubStrategy from "passport-github2";
import UserModel from "../models/user.model.js";

//import { Strategy as GitHubStrategy } from "passport-github2";
//import { generateToken } from "../utils/jsonwebtoken.js";

passport.serializeUser((user, done) => {
    done(null, user._id);
})
passport.deserializeUser(async (id, done) => {
    let user = await UserModel.findById({ _id: id });
    done(null, user);
})

passport.use("github", new GithubStrategy({
    clientID: "Iv23li0VyEFTNFy9orif",
    clientSecret: "6313f9a73b5d83f3b7094e96c1c53d20c89cd719",
    callbackURL: "http://localhost:8080/api/sessions/githubcallback"
}, async (accessToken, refreshToken, profile, done) => {
    console.log("perfil", profile);
    try {
        let user = await UserModel.findOne({ email: profile._json.email });

        if (!user) {
            let newUser = {
                first_name: profile._json.name || profile.username, // Si 'name' está vacío, usar el username
                last_name: "",      // No dispones de apellido en GitHub
                age: 0,             // Puedes asignar un valor por defecto, o dejarlo fuera si no es obligatorio
                email: profile._json.email, // O también puedes usar profile.emails[0].value si existe
                password: ""        // Puedes dejarlo vacío o un valor predeterminado, ya que se autenticará vía GitHub
            }


            let result = await UserModel.create(newUser);
            done(null, result);

        } else {
            done(null, user);
        }
    } catch (error) {
        return done(error);
    }
}))








export default initializePassport;