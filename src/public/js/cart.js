
function comprar(cartId){
    try {
         fetch(`/api/carts/${cartId}/purchase`, {
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            }
        }).then(result => {
            if(result.status===200){
                console.log(result);
                window.location.replace('/ticket');
            }else{
                alert("El usuario no existe, intente nuevamente")
            }
          

        })
    } catch (error) {
        console.log(error);
    }
}

  

