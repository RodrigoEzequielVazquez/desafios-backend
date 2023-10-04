export const rolesMiddlewaresAdmin = (req,res,next)=>{
    console.log(req.user);
    if (req.user.rol === "Admin") {
        next()
    }
    else{
        res.send({error: "No tenes acceso"})
    }
}

export const rolesMiddlewaresUser = (req,res,next)=>{
    console.log(req.user);
    if (req.user.rol === "User") {
        next()
    }
    else{
        res.send({error: "No tenes acceso"})
    }
}

export const rolesMiddlewaresPremium = (req,res,next)=>{
    console.log(req.user);
    if (req.user.rol === "Premium") {
        next()
    }
    else{
        res.send({error: "No tenes acceso"})
    }
}

export const rolesMiddlewaresPremiumOuser = (req,res,next)=>{
    console.log(req.user);
    if (req.user.rol === "Premium" || req.user.rol === "User") {
        next()
    }
    else{
        res.send({error: "No tenes acceso"})
    }
}