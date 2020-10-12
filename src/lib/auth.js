module.exports = {
    //verificar si el usuario esta loggeado
    isLoggedIn(req,res,next){
        //verificar si esta autentificado
        if(req.isAuthenticated()) 
            //si si lo esta, continua
            return next()
        //sino redirreccionalo para que los haga
        return res.redirect('/signin') 
    },   
    //verificar si el usuario NO esta loggeado
    isNotLoggedIn(req,res,next){
        //verificar si NO esta autentificado
        if(!req.isAuthenticated()) 
            //si no, continua
            return next()
        //si si redirreccionalo para que los haga
        return res.redirect('/profile') 
    }
}