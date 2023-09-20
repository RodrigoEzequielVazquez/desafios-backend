export class CurrentUserDTO{
    constructor(user){
        this.nombre=user.nombre,
        this.apellido=user.apellido,
        this.email=user.email,
        this.cart=user.cart,
        this.rol=user.rol
    }
}