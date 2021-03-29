const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Referencia al modelo donde vamos a autenticar
const Usuarios = require('../model/Usuarios');

//local strategy - login con credenciales propios (usuario y pasasword)
passport.use(
    new LocalStrategy(
        //por default passport espera un usuario y password
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) =>{
            try {
                const usuario = await Usuarios.findOne({
                    where: { 
                        email,
                        activo: 1
                    }
                });
                // el usuario existe, password incorrecto
                if(!usuario.verificarPassword(password)){
                    return done(null, false, {
                        message: 'Password Incorrecto'
                    });
                }
                // el email existe y el password es correcto
                return done(null, usuario);
            } catch (error) {
                //ese usuario no existe
                return done(null, false, {
                    message: 'Esa cuenta no existe'
                })
            }
        }
    )
);

//serializar el usuario
passport.serializeUser((usuario, callback) =>{
    callback(null, usuario);
});

//deserealizar el usuario
passport.deserializeUser((usuario, callback) =>{
    callback(null, usuario);
});

//exportar
module.exports = passport;