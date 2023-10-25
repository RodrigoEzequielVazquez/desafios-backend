export const rolesMiddlewaresAdmin = (req,res,next)=>{
    if (req.user.rol === "Admin") {
        next()
    }
    else{
        res.send({error: "error", payload: "No tenes acceso"})
    }
}

export const rolesMiddlewaresUser = (req,res,next)=>{
    if (req.user.rol === "User") {
        next()
    }
    else{
        res.send({error: "error", payload: "No tenes acceso"})
    }
}

export const rolesMiddlewaresPremium = (req,res,next)=>{
    if (req.user.rol === "Premium") {
        next()
    }
    else{
        res.send({error: "error", payload: "No tenes acceso"})
    }
}

export const rolesMiddlewaresPremiumOuser = (req,res,next)=>{
    
    if (req.user.rol === "Premium" || req.user.rol === "User") {
        next()
    }
    else{
        res.send({error: "error", payload: "No tenes acceso"})
    }
}

export const rolesMiddlewaresPremiumOAdmin = (req,res,next)=>{
    
    if (req.user.rol === "Premium" || req.user.rol === "Admin") {
        next()
    }
    else{
        res.send({error: "error", payload: "No tenes acceso"})
    }
}