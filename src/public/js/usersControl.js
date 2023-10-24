const btnsEliminar = document.getElementsByClassName("eliminarUser")
const btnsActualizarRol = document.getElementsByClassName("actualizarRol")

console.log(btnsActualizarRol,btnsEliminar);

for (const btn of btnsActualizarRol) {
    btn.addEventListener("click", (e) =>{
        let uid = e.target.id
        console.log(uid);
        try {
            fetch('/api/users/premium/'+uid,{
                method:'PUT',
                body:JSON.stringify({uid:uid}),
                headers:{
                    'Content-Type':'application/json'
                }
            }).then(result=>{
                if(result.status===200){
                    console.log(result.status);
                    window.location.replace('/usersControl');
                }else{
                    alert("El usuario no existe, intente nuevamente")
                }
            })
        } catch (error) {
            console.log(error);
        }
    })
}
for (const btn of btnsEliminar) {

    btn.addEventListener("click", (e) =>{
            console.log(e.target.className)
            let email = e.target.id
            try {
                fetch('/api/users/delete/'+ email,{
                    method:'DELETE',
                    body:JSON.stringify({email:email}),
                    headers:{
                        'Content-Type':'application/json'
                    }
                }).then(result=>{
                    if(result.status===200){
                        console.log(result.status);
                        window.location.replace('/usersControl');
                    }else{
                        alert("El usuario no existe, intente nuevamente")
                    }
                })
            } catch (error) {
                console.log(error);
            }
        })
    
}
