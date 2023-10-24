export class UsersDTO{
    constructor(user, view){
        console.log(user);
        console.log("view en dto");
        if (view == "admin") {
            this.nombre=user.first_name,
            this.apellido=user.last_name,
            this.email=user.email,
            this.rol=user.role,
            this.id=user._id
        }
        else{
            this.nombre=user.first_name,
            this.apellido=user.last_name,
            this.email=user.email,
            this.rol=user.role
        }
    }
}