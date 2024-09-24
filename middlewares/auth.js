
const {convertTokenToUser} = require("../services/auth")


const checkForAuthentication = (cookieName) =>{
    
   return (req,res,next)  =>{

    let tokenCookie = req.cookies[cookieName]

    if(!tokenCookie) return next()

        try{
            let user = convertTokenToUser(tokenCookie)
            req.user = user
        }
        catch(err){  }

        return next()
   }
}

module.exports = {
    checkForAuthentication,
}